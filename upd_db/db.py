from pymongo.errors import BulkWriteError
import datetime
import random
import time
import requests
import os
import proxy
import json
import inspect
import re
import csv
from requests.exceptions import ProxyError, SSLError

class DataOps:
    def __init__(self, finnhub_client, db, number_of_assets):
        self._symbols = self.get_symbol_list()[:number_of_assets]
        self._symbols_sp500 = self.get_sp500_symbol_list()
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
            return tuple(filter(lambda x : 1 if x["type"] == "Common Stock" else 0, response.json()))
    
    def get_sp500_symbol_list(self):
        sp500_lst = []
        with open('sp500.csv', newline='') as sp500:
            reader = csv.DictReader(sp500)
            for row in reader:
                sp500_lst.append(row['Symbol'])
        return tuple(sp500_lst)

    # data
    def call_all_authed(self):
        time.sleep(10)
        self.create_indices()
        for idx, item in enumerate(self._symbols_sp500):
            symbol = item
            data = []
            ext = False
            if idx != 0 and idx % 3 == 0:
                time.sleep(60)
            
            for get_func in [self.get_company_profile, self.get_candles, self.get_technicals]:
                d = get_func(symbol)
                if d is not None:
                    data.append(d)
                else:
                    print(f'{symbol} is not eligible for persisting in the db')
                    ext = True
                    break
            
            if ext == True:
                continue

            for i, write_func in enumerate([self.write_company_profile, self.write_candles, self.write_technicals]):
                write_func(symbol, data[i])
        

    # INDICES
    def create_indices(self):
        self._db.recommendation_trends.create_index([("period", 1), ("symbol", 1)], unique=True)
        self._db.financials_reported.create_index([("accessNumber", 1), ("symbol", 1)], unique=True)
        self._db.earnings_calendar.create_index([("date", 1), ("symbol", 1)], unique=True)
        self._db.candles.create_index([("timestamp", 1), ("symbol", 1)], unique=True)
        self._db.company_profile.create_index([("ticker", 1), ("shareOutstanding", 1)], unique=True)
        self._db.technicals.create_index([("symbol", 1), ("t", 1)], unique=True)
        self._db.financials.create_index([("period", 1), ("symbol", 1), ('accumulatedDepreciationTotal', 1)], unique=True)
    
    # COLLECTING DATA

    def get_recommendation_trends(self, symbol):
        func_name = inspect.currentframe().f_code.co_name
        print(f"{func_name} has started executing")
        print(f"Downloading {symbol}")
        try:
            result = self._finnhub_client.recommendation_trends(symbol)
        except:
            print(f'Could not dowload {symbol} (possible conn error)')
            return
        if result != [] and result != {'s': 'no_data'}:
            return result
        else:
            print(f"{func_name}: Cannot insert {symbol} as the response is empty")


    def write_recommendation_trends(self, symbol, chunk):
        func_name = inspect.currentframe().f_code.co_name
        try:
            self._db.recommendation_trends.insert_many(chunk)
        except BulkWriteError as bwe:
            print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
            return


    def get_financials_reported(self, symbol):
        func_name = inspect.currentframe().f_code.co_name
        print(f"{func_name} has started executing")
        print(f"Downloading {symbol}")
        try:
            result = self._finnhub_client.financials_reported(symbol=symbol, freq='quarterly')
        except:
            print(f'Could not dowload {symbol} (possible conn error)')
            return
        if result != {} and result != {'s': 'no_data'} and result["data"] != []:
            try:
                for entry in result["data"]:
                    entry["startDate"] = datetime.datetime.strptime(entry["startDate"], '%Y-%m-%d %H:%M:%S')
                    entry["endDate"] = datetime.datetime.strptime(entry["endDate"], '%Y-%m-%d %H:%M:%S')
                    entry["filedDate"] = datetime.datetime.strptime(entry["filedDate"], '%Y-%m-%d %H:%M:%S')
                    entry["acceptedDate"] = datetime.datetime.strptime(entry["acceptedDate"], '%Y-%m-%d %H:%M:%S')
            except:
                print(f'Missing data for {symbol} in {func_name}')
                return
            return result["data"]
        else:
            print(f"{func_name}: Cannot insert {symbol} as the response is empty")


    def write_financials_reported(self, symbol, chunk):
        func_name = inspect.currentframe().f_code.co_name
        try:
            self._db.financials_reported.insert_many(chunk)
        except BulkWriteError as bwe:
            print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
            return
    

    def get_earnings_calendar(self, symbol):
        func_name = inspect.currentframe().f_code.co_name
        print(f"{func_name} has started executing")
        print(f"Downloading {symbol}")
        try:
            result = self._finnhub_client.earnings_calendar(symbol=symbol)
        except:
            print(f'Could not dowload {symbol} (possible conn error)')
            return
        if result != {} and result != {'s': 'no_data'} and result["earningsCalendar"] != []:
            return result["earningsCalendar"]
        else:
            print(f"{func_name}: Cannot insert {symbol} as the response is empty")


    def write_earnings_calendar(self, symbol, chunk):
        func_name = inspect.currentframe().f_code.co_name
        try:
            self._db.earnings_calendar.insert_many(chunk)
        except BulkWriteError as bwe:
            print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
            return

    
    def get_candles(self, symbol):
        func_name = inspect.currentframe().f_code.co_name
        print(f"{func_name} has started executing")
        print(f"Downloading {symbol}")
        chunk = []
        try:
            result = self._finnhub_client.stock_candles(symbol=symbol, resolution="D", _from=self._INIT_TIMESTAMP, to=self._CURRENT_TIMESTAMP)
        except:
            print(f'Could not dowload {symbol} (possible conn error)')
            return
        if result != {} and result != {'s': 'no_data'} and result["c"] != [] and result["t"] != []:
            if (len(result["c"]) != len(result["t"]) != len(result["h"]) != len(result["l"]) != len(result["v"])):
                return
            for i in range(0, len(result["c"])):
                chunk.append({
                    "symbol": symbol,
                    "timestamp": datetime.datetime.fromtimestamp(result["t"][i]),
                    "close": result["c"][i],
                    "high": result["h"][i],
                    "low": result["l"][i],
                    "volume": result["v"][i],
                })
            return chunk
        else:
            print(f"{func_name}: Cannot insert {symbol} as the response is empty")
    

    def write_candles(self, symbol, chunk):
        func_name = inspect.currentframe().f_code.co_name
        try:
            self._db.candles.insert_many(chunk)
        except BulkWriteError as bwe:
            print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
            return


    def get_company_profile(self, symbol):
        func_name = inspect.currentframe().f_code.co_name
        print(f"{func_name} has started executing")
        print(f"Downloading {symbol}")
        try:
            result = self._finnhub_client.company_profile2(symbol=symbol)
        except:
            print(f'Could not dowload {symbol} (possible conn error)')
            return
        if result != {}:
                try:
                    weburl = result['weburl']
                    patterns = ['http://', 'https://', 'http://www.', 'https://www.']
                    for p in patterns:
                        if weburl.startswith(p):
                            weburl = weburl.replace(p, '')
                    weburl = re.sub('.com.*$', '.com', weburl)
                    logourl = f'http://logo.clearbit.com/{weburl}?size=88'
                    r = requests.get(logourl)
                    if r.status_code != 200:
                        print(f'Invalid weburl with {symbol}')
                        return
                    else:
                        result['logo'] = logourl
                except:
                    print(f'Image issue with {symbol}')
                    return
                return result
        else:
            print(f"{func_name}: Cannot insert {symbol} as the response is empty")
    

    def write_company_profile(self, symbol, chunk):
        func_name = inspect.currentframe().f_code.co_name
        try:
            self._db.company_profile.insert_one(chunk)
        except BulkWriteError as bwe:
            print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")


    def get_technicals(self, symbol, cut=30):
        func_name = inspect.currentframe().f_code.co_name
        print(f"{func_name} has started executing")
        with open('technicals.json') as json_technicals:
            technicals_dict = json.load(json_technicals)

            print(f"Downloading {symbol}")
            data_obj = {
                "symbol": symbol,
                "data": {}
            }
            for idx, indicator in enumerate(technicals_dict):
                indicator_alias = technicals_dict[indicator]
                try:
                    result = self._finnhub_client.technical_indicator(symbol, "D", self._INIT_TIMESTAMP, self._CURRENT_TIMESTAMP, 
                        indicator, indicator_alias["params"])
                except:
                    print(f'Could not dowload {symbol} (possible conn error)')
                    continue
                indicator_timestamp_list = result["t"]
                if len(indicator_timestamp_list) <= cut:
                    print(f'Insufficient {indicator} data for {symbol}')
                    break
                if idx == 0:
                    data_obj["data"]["t"] = indicator_timestamp_list[cut:]
                    print(f'{indicator} length: {len(data_obj["data"]["t"])}')
                else:
                    print(f'{indicator} Timestamp lists equality: {data_obj["data"]["t"] == indicator_timestamp_list[cut:]}, lengths: {len(data_obj["data"]["t"])+cut} - {len(indicator_timestamp_list)}')
                for s in indicator_alias["retrievable_symbols"]:
                    data_obj["data"][str.upper(s)] = result[s][cut:]
            if data_obj["data"] == {}:
                return
            data_obj["data"]["t"] = list(map(lambda x: datetime.datetime.fromtimestamp(x), data_obj["data"]["t"]))
            db_arr = []
            for i in range(0, len(data_obj["data"]["t"])):
                obj = {
                    "symbol": data_obj["symbol"],
                    "indicators": []
                }
                for key in data_obj["data"]:
                    if key == "t":
                        obj[key] = data_obj["data"][key][i]
                    else:
                        obj["indicators"].append({
                            "name": key,
                            "value": data_obj["data"][key][i]
                        })
                db_arr.append(obj)
            return db_arr


    def write_technicals(self, symbol, chunk):
        func_name = inspect.currentframe().f_code.co_name
        try:
            self._db.technicals.insert_many(chunk)
        except BulkWriteError as bwe:
            print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")


    # unauthed
    # def get_financials(self):
    #     func_name = inspect.currentframe().f_code.co_name
    #     print(f"{func_name} has started executing")
    #     i = 0
    #     delay = 15
    #     local_used_proxies = {}
    #     for item in self._symbols:
    #         symbol = item["symbol"]
    #         print(f"Downloading {symbol}")
    #         result = {}
    #         status = self._STATUS_LIMIT_EXCEEDED
    #         while status == self._STATUS_LIMIT_EXCEEDED:
    #             print(self._proxies)
    #             current_proxy = self._proxies[i]["https"]
    #             if current_proxy in local_used_proxies:
    #                 i = self._iterate_proxies(i, delay)
    #                 continue
    #             try: 
    #                 try:
    #                     response = requests.get(f"https://finnhub.io/api/v1/stock/financials?symbol={symbol}&statement=bs&freq=quarterly", 
    #                                     proxies=self._proxies[i])
    #                 except:
    #                     print(f'Could not dowload {symbol} (possible conn error)')
    #                     continue
    #                 if response.text == self._UNAUTHED_STRING:
    #                     print(f'Unauthed for proxy {current_proxy}')
    #                     i = self._iterate_proxies(i, delay)
    #                     continue
    #             except (ProxyError, SSLError):
    #                 print(f'Proxy error occured for proxy {current_proxy}')
    #                 i = self._iterate_proxies(i, delay)
    #                 continue
    #             status = response.status_code 
    #             if status == self._STATUS_LIMIT_EXCEEDED:
    #                 local_used_proxies[current_proxy] = self._proxies[i]
    #                 i = self._iterate_proxies(i, delay)
    #                 continue
    #             elif status != self._STATUS_SUCCESS:
    #                 print(f"{func_name}: Error {status} - {symbol} occured")
    #                 i = self._iterate_proxies(i, delay)
    #                 continue
    #             else:
    #                 result = response.json()
    #         if result != {} and result != {'s': 'no_data'} and result["financials"] != []:
    #             for f in result["financials"]:
    #                 f["symbol"] = symbol
    #             try:
    #                 self._db.financials.insert_many(result["financials"]) 
    #             except BulkWriteError as bwe:
    #                 print(f"{func_name}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
    #         else:
    #             print(f"{func_name}: Cannot insert {symbol} as the response is empty")



