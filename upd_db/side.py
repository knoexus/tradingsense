from pymongo.errors import BulkWriteError
import datetime
import time
import requests
import os
import proxy
import json
import inspect
from requests.exceptions import ProxyError, SSLError

def get_symbol_list():
    raw_symbols = requests.get(f"https://finnhub.io/api/v1/stock/symbol?exchange=US&token={os.environ['FINNHUB_API_KEY']}")
    return tuple(filter(filter_symbol, raw_symbols.json()))

def filter_symbol(x):
    if x["type"] == "EQS":
        return 1
    else:
        return 0

class DataOps:
    def __init__(self, finnhub_client, db, number_of_assets):
        self.symbols = get_symbol_list()[:number_of_assets]
        self.finnhub_client = finnhub_client
        self.db = db
        self.proxies = self.map_proxies()
    
    STATUS_LIMIT_EXCEEDED = 429
    STATUS_SUCCESS = 200

    UNAUTHED_STRING = "You don't have access to this resource."

    INIT_TIMESTAMP = 1260576000
    CURRENT_TIMESTAMP = int(time.time())

    # helper
    def set_timeout_based_on_current_index(self, idx, max_requests=60, timeout_second=61):
        if idx != 0 and idx % max_requests == 0:
            print(f"{inspect.currentframe().f_code.co_name} timeout started")
            time.sleep(timeout_second)
    
    def map_proxies(self, delay=0):
        return list(map(lambda x: {
            "http": x,
            "https": x
        }, proxy.get_proxies(delay=delay))) 

    def iterate_proxies(self, val, delay):
        if val == len(self.proxies)-1:
            self.map_proxies(delay)
            return 0   
        else:
            return val + 1

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
        self.db.recommendation_trends.create_index([("period", 1), ("symbol", 1)], unique=True)
        for idx, item in enumerate(self.symbols):
            self.set_timeout_based_on_current_index(idx)
            symbol = item["symbol"]
            print(f"Downloading {symbol}")
            result = self.finnhub_client.recommendation_trends(symbol)
            if result != []:
                try:
                    self.db.recommendation_trends.insert_many(result)
                except BulkWriteError as bwe:
                    print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
                    continue
            else:
                print(f"{func_name}: Cannot insert {symbol} as the response is empty")

    def get_financials_reported(self):
        func_name = inspect.currentframe().f_code.co_name
        print(f"{func_name} has started executing")
        self.db.financials_reported.create_index([("accessNumber", 1), ("symbol", 1)], unique=True)
        for idx, item in enumerate(self.symbols):
            self.set_timeout_based_on_current_index(idx)
            symbol = item["symbol"]
            print(f"Downloading {symbol}")
            result = self.finnhub_client.financials_reported(symbol=symbol, freq='quarterly')
            if result != {} and result["data"] != []:
                try:
                    self.db.financials_reported.insert_many(result["data"])
                except BulkWriteError as bwe:
                    print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
                    continue
            else:
                print(f"{func_name}: Cannot insert {symbol} as the response is empty")
    
    def get_earnings_calendar(self):
        func_name = inspect.currentframe().f_code.co_name
        print(f"{func_name} has started executing")
        self.db.earnings_calendar.create_index([("date", 1), ("symbol", 1)], unique=True)
        for idx, item in enumerate(self.symbols):
            self.set_timeout_based_on_current_index(idx)
            symbol = item["symbol"]
            print(f"Downloading {symbol}")
            result = self.finnhub_client.earnings_calendar(symbol=symbol)
            if result != {} and result["earningsCalendar"] != []:
                try:
                    self.db.earnings_calendar.insert_many(result["earningsCalendar"])
                except BulkWriteError as bwe:
                    print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
                    continue
            else:
                print(f"{func_name}: Cannot insert {symbol} as the response is empty")
    
    def get_candles(self):
        func_name = inspect.currentframe().f_code.co_name
        print(f"{func_name} has started executing")
        self.db.candles.create_index([("timestamp", 1), ("symbol", 1)], unique=True)
        for idx, item in enumerate(self.symbols):
            self.set_timeout_based_on_current_index(idx)
            symbol = item["symbol"]
            print(f"Downloading {symbol}")
            result = self.finnhub_client.stock_candles(symbol=symbol, resolution="D", _from=self.INIT_TIMESTAMP, to=self.CURRENT_TIMESTAMP)
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
                    self.db.candles.insert_many(transformed)
                except BulkWriteError as bwe:
                    print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
                    continue
            else:
                print(f"{func_name}: Cannot insert {symbol} as the response is empty")

    def get_company_profile(self):
        func_name = inspect.currentframe().f_code.co_name
        print(f"{func_name} has started executing")
        self.db.company_profile.create_index([("symbol", 1), ("shareOutstanding", 1)], unique=True)
        data_list = []
        for idx, item in enumerate(self.symbols):
            self.set_timeout_based_on_current_index(idx)
            symbol = item["symbol"]
            print(f"Downloading {symbol}")
            result = self.finnhub_client.company_profile2(symbol=symbol)
            if result != {}:
                data_list.append(result)
            else:
                print(f"{func_name}: Cannot insert {symbol} as the response is empty")
        try:
            self.db.company_profile.insert_many(data_list) 
        except BulkWriteError as bwe:
            print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")

    def get_technicals(self, cut=30):
        func_name = inspect.currentframe().f_code.co_name
        print(f"{func_name} has started executing")
        with open('technicals.json') as json_technicals:
            technicals_dict = json.load(json_technicals)
            count_for_timeout = 0
            for item in self.symbols:
                symbol = item["symbol"]
                print(f"Downloading {symbol}")
                data_obj = {
                    "symbol": symbol,
                    "data": {}
                }
                for idx, indicator in enumerate(technicals_dict):
                    count_for_timeout += 1
                    self.set_timeout_based_on_current_index(count_for_timeout) 
                    indicator_alias = technicals_dict[indicator]
                    result = self.finnhub_client.technical_indicator(symbol, "D", self.INIT_TIMESTAMP, self.CURRENT_TIMESTAMP, 
                        indicator, indicator_alias["params"])
                    if idx == 0:
                        data_obj["data"]["t"] = result["t"][:-cut]
                    else:
                        print(f'Timestamp lists equality: {data_obj["data"]["t"] == result["t"][:-cut]}, lengths: {len(data_obj["data"]["t"])+cut} - {len(result["t"])}')
                    for s in indicator_alias["retrievable_symbols"]:
                        data_obj["data"][str.upper(s)] = result[s][:-cut]
                data_obj["data"]["t"] = list(map(lambda x: datetime.datetime.fromtimestamp(x), data_obj["data"]["t"]))
                try:
                    self.db.technicals.replace_one({"symbol": symbol}, data_obj, upsert=True)
                except BulkWriteError as bwe:
                    print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
                
    # unauthed
    def get_financials(self):
        func_name = inspect.currentframe().f_code.co_name
        print(f"{func_name} has started executing")
        self.db.financials.create_index([("period", 1), ("symbol", 1), ('accumulatedDepreciationTotal', 1)], unique=True)
        i = 0
        delay = 15
        local_used_proxies = {}
        for item in self.symbols:
            symbol = item["symbol"]
            print(f"Downloading {symbol}")
            result = {}
            status = self.STATUS_LIMIT_EXCEEDED
            while status == self.STATUS_LIMIT_EXCEEDED:
                print(self.proxies)
                current_proxy = self.proxies[i]["https"]
                if current_proxy in local_used_proxies:
                    i = self.iterate_proxies(i, delay)
                    continue
                try: 
                    response = requests.get(f"https://finnhub.io/api/v1/stock/financials?symbol={symbol}&statement=bs&freq=quarterly", proxies=self.proxies[i])
                    if response.text == self.UNAUTHED_STRING:
                        print(f'Unauthed for proxy {current_proxy}')
                        i = self.iterate_proxies(i, delay)
                        continue
                except (ProxyError, SSLError):
                    print(f'Proxy error occured for proxy {current_proxy}')
                    i = self.iterate_proxies(i, delay)
                    continue
                status = response.status_code 
                if status == self.STATUS_LIMIT_EXCEEDED:
                    local_used_proxies[current_proxy] = self.proxies[i]
                    i = self.iterate_proxies(i, delay)
                    continue
                elif status != self.STATUS_SUCCESS:
                    print(f"{func_name}: Error {status} - {symbol} occured")
                    i = self.iterate_proxies(i, delay)
                    continue
                else:
                    result = response.json()
            if result != {} and result["financials"] != []:
                for f in result["financials"]:
                    f["symbol"] = symbol
                try:
                    self.db.financials.insert_many(result["financials"]) 
                except BulkWriteError as bwe:
                    print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
            else:
                print(f"{func_name}: Cannot insert {symbol} as the response is empty")



