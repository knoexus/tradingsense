from pymongo.errors import BulkWriteError
import datetime
import time
import requests
import os
import proxy
import json
import inspect
from requests.exceptions import ProxyError, SSLError

class DataOps:
    def __init__(self, finnhub_client, db, number_of_assets):
        self._symbols = self.get_symbol_list()[:number_of_assets]
        self._finnhub_client = finnhub_client
        self._db = db
        self._proxies = self._map_proxies()
    
    _STATUS_LIMIT_EXCEEDED = 429
    _STATUS_SUCCESS = 200

    _UNAUTHED_STRING = "You don't have access to this resource."

    _INIT_TIMESTAMP = 1260576000
    _CURRENT_TIMESTAMP = int(time.time())

    # helper
    def _set_timeout_based_on_current_index(self, idx, max_requests=59, timeout_second=61):
        if idx != 0 and idx % max_requests == 0:
            print(f"{inspect.currentframe().f_code.co_name} timeout started")
            time.sleep(timeout_second)
    
    def _map_proxies(self, delay=0):
        return list(map(lambda x: {
            "http": x,
            "https": x
        }, proxy.get_proxies(delay=delay))) 

    def _iterate_proxies(self, val, delay):
        if val == len(self._proxies)-1:
            self._map_proxies(delay)
            return 0   
        else:
            return val + 1

    # symbols
    def get_symbol_list(self):
        response = requests.get(f"https://finnhub.io/api/v1/stock/symbol?exchange=US&token={os.environ['FINNHUB_API_KEY']}")
        if response.status_code != 200:
            print(f'{inspect.currentframe().f_code.co_name}: cannot retrieve symbols')
            return tuple([])
        else:
            return tuple(filter(lambda x : 1 if x["type"] == "EQS" else 0, response.json()))

    # data
    def call_all_authed(self):
        methods = [self.get_recommendation_trends, self.get_financials_reported, self.get_earnings_calendar, 
                    self.get_candles, self.get_company_profile, self.get_technicals]
        for method in methods:
            method()
            time.sleep(60)
    
    def call_all(self):
        self.call_all_authed()
        self.get_financials()

    def get_recommendation_trends(self):
        func_name = inspect.currentframe().f_code.co_name
        print(f"{func_name} has started executing")
        self._db.recommendation_trends.create_index([("period", 1), ("symbol", 1)], unique=True)
        for idx, item in enumerate(self._symbols):
            self._set_timeout_based_on_current_index(idx)
            symbol = item["symbol"]
            print(f"Downloading {symbol}")
            result = self._finnhub_client.recommendation_trends(symbol)
            if result != []:
                try:
                    self._db.recommendation_trends.insert_many(result)
                except BulkWriteError as bwe:
                    print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
                    continue
            else:
                print(f"{func_name}: Cannot insert {symbol} as the response is empty")

    def get_financials_reported(self):
        func_name = inspect.currentframe().f_code.co_name
        print(f"{func_name} has started executing")
        self._db.financials_reported.create_index([("accessNumber", 1), ("symbol", 1)], unique=True)
        for idx, item in enumerate(self._symbols):
            self._set_timeout_based_on_current_index(idx)
            symbol = item["symbol"]
            print(f"Downloading {symbol}")
            result = self._finnhub_client.financials_reported(symbol=symbol, freq='quarterly')
            if result != {} and result["data"] != []:
                try:
                    self._db.financials_reported.insert_many(result["data"])
                except BulkWriteError as bwe:
                    print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
                    continue
            else:
                print(f"{func_name}: Cannot insert {symbol} as the response is empty")
    
    def get_earnings_calendar(self):
        func_name = inspect.currentframe().f_code.co_name
        print(f"{func_name} has started executing")
        self._db.earnings_calendar.create_index([("date", 1), ("symbol", 1)], unique=True)
        for idx, item in enumerate(self._symbols):
            self._set_timeout_based_on_current_index(idx)
            symbol = item["symbol"]
            print(f"Downloading {symbol}")
            result = self._finnhub_client.earnings_calendar(symbol=symbol)
            if result != {} and result["earningsCalendar"] != []:
                try:
                    self._db.earnings_calendar.insert_many(result["earningsCalendar"])
                except BulkWriteError as bwe:
                    print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
                    continue
            else:
                print(f"{func_name}: Cannot insert {symbol} as the response is empty")
    
    def get_candles(self):
        func_name = inspect.currentframe().f_code.co_name
        print(f"{func_name} has started executing")
        self._db.candles.create_index([("timestamp", 1), ("symbol", 1)], unique=True)
        for idx, item in enumerate(self._symbols):
            self._set_timeout_based_on_current_index(idx)
            symbol = item["symbol"]
            print(f"Downloading {symbol}")
            result = self._finnhub_client.stock_candles(symbol=symbol, resolution="D", _from=self._INIT_TIMESTAMP, to=self._CURRENT_TIMESTAMP)
            if result != {} and result["c"] != [] and result["t"] != []:
                try:
                    transformed = []
                    if (len(result["c"]) != len(result["t"]) != len(result["h"]) != len(result["l"]) != len(result["v"])):
                        continue
                    for i in range(0, len(result["c"])):
                        transformed.append({
                            "symbol": symbol,
                            "timestamp": datetime.datetime.fromtimestamp(result["t"][i]),
                            "close": result["c"][i],
                            "high": result["h"][i],
                            "low": result["l"][i],
                            "volume": result["v"][i],
                        })
                    self._db.candles.insert_many(transformed)
                except BulkWriteError as bwe:
                    print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
                    continue
            else:
                print(f"{func_name}: Cannot insert {symbol} as the response is empty")

    def get_company_profile(self):
        func_name = inspect.currentframe().f_code.co_name
        print(f"{func_name} has started executing")
        self._db.company_profile.create_index([("symbol", 1), ("shareOutstanding", 1)], unique=True)
        data_list = []
        for idx, item in enumerate(self._symbols):
            self._set_timeout_based_on_current_index(idx)
            symbol = item["symbol"]
            print(f"Downloading {symbol}")
            result = self._finnhub_client.company_profile2(symbol=symbol)
            if result != {}:
                data_list.append(result)
            else:
                print(f"{func_name}: Cannot insert {symbol} as the response is empty")
        try:
            self._db.company_profile.insert_many(data_list) 
        except BulkWriteError as bwe:
            print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")

    def get_technicals(self, cut=30):
        func_name = inspect.currentframe().f_code.co_name
        print(f"{func_name} has started executing")
        self._db.technicals_split.create_index([("symbol", 1), ("t", 1)], unique=True)
        with open('technicals.json') as json_technicals:
            technicals_dict = json.load(json_technicals)
            count_for_timeout = 0
            for item in self._symbols:
                symbol = item["symbol"]
                print(f"Downloading {symbol}")
                data_obj = {
                    "symbol": symbol,
                    "data": {}
                }
                for idx, indicator in enumerate(technicals_dict):
                    count_for_timeout += 1
                    self._set_timeout_based_on_current_index(count_for_timeout) 
                    indicator_alias = technicals_dict[indicator]
                    result = self._finnhub_client.technical_indicator(symbol, "D", self._INIT_TIMESTAMP, self._CURRENT_TIMESTAMP, 
                        indicator, indicator_alias["params"])
                    if idx == 0:
                        data_obj["data"]["t"] = result["t"][cut:]
                    else:
                        print(f'Timestamp lists equality: {data_obj["data"]["t"] == result["t"][cut:]}, lengths: {len(data_obj["data"]["t"])+cut} - {len(result["t"])}')
                    for s in indicator_alias["retrievable_symbols"]:
                        data_obj["data"][str.upper(s)] = result[s][cut:]
                data_obj["data"]["t"] = list(map(lambda x: datetime.datetime.fromtimestamp(x), data_obj["data"]["t"]))
                db_arr = []
                for i in range(0, len(data_obj["data"]["t"])):
                    obj = {
                        "symbol": data_obj["symbol"]
                    }
                    for key in data_obj["data"]:
                        obj[key] = data_obj["data"][key][i]
                    db_arr.append(obj)
                try:
                    self._db.technicals_split.insert_many(db_arr)
                except BulkWriteError as bwe:
                    print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
                
    # unauthed
    def get_financials(self):
        func_name = inspect.currentframe().f_code.co_name
        print(f"{func_name} has started executing")
        self._db.financials.create_index([("period", 1), ("symbol", 1), ('accumulatedDepreciationTotal', 1)], unique=True)
        i = 0
        delay = 15
        local_used_proxies = {}
        for item in self._symbols:
            symbol = item["symbol"]
            print(f"Downloading {symbol}")
            result = {}
            status = self._STATUS_LIMIT_EXCEEDED
            while status == self._STATUS_LIMIT_EXCEEDED:
                print(self._proxies)
                current_proxy = self._proxies[i]["https"]
                if current_proxy in local_used_proxies:
                    i = self._iterate_proxies(i, delay)
                    continue
                try: 
                    response = requests.get(f"https://finnhub.io/api/v1/stock/financials?symbol={symbol}&statement=bs&freq=quarterly", 
                                    proxies=self._proxies[i])
                    if response.text == self._UNAUTHED_STRING:
                        print(f'Unauthed for proxy {current_proxy}')
                        i = self._iterate_proxies(i, delay)
                        continue
                except (ProxyError, SSLError):
                    print(f'Proxy error occured for proxy {current_proxy}')
                    i = self._iterate_proxies(i, delay)
                    continue
                status = response.status_code 
                if status == self._STATUS_LIMIT_EXCEEDED:
                    local_used_proxies[current_proxy] = self._proxies[i]
                    i = self._iterate_proxies(i, delay)
                    continue
                elif status != self._STATUS_SUCCESS:
                    print(f"{func_name}: Error {status} - {symbol} occured")
                    i = self._iterate_proxies(i, delay)
                    continue
                else:
                    result = response.json()
            if result != {} and result["financials"] != []:
                for f in result["financials"]:
                    f["symbol"] = symbol
                try:
                    self._db.financials.insert_many(result["financials"]) 
                except BulkWriteError as bwe:
                    print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
            else:
                print(f"{func_name}: Cannot insert {symbol} as the response is empty")



