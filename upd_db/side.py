from pymongo.errors import BulkWriteError
import datetime
import time
import requests
import os

def get_symbol_list():
    raw_symbols = requests.get(f"https://finnhub.io/api/v1/stock/symbol?exchange=US&token={os.environ['FINNHUB_API_KEY']}")
    return list(filter(filter_symbol, raw_symbols.json()))

def filter_symbol(x):
    if x["type"] == "EQS":
        return 1
    else:
        return 0

class DataOps:
    def __init__(self, finnhub_client, db):
        self.symbols = get_symbol_list()[:10]
        self.finnhub_client = finnhub_client
        self.db = db

    def get_recommendation_trends(self):
        self.db.recommendation_trends.create_index([("period", 1), ("symbol", 1)], unique=True)
        for item in self.symbols:
            symbol = item["symbol"]
            print(f"Downloading {symbol}")
            result = self.finnhub_client.recommendation_trends(symbol)
            if result != []:
                try:
                    self.db.recommendation_trends.insert_many(result)
                except BulkWriteError as bwe:
                    print(f"{self.get_recommendation_trends.__name__}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
                    continue
            else:
                print(f"{self.get_recommendation_trends.__name__}: Cannot insert {symbol} as the response is empty")

    def get_financials_reported(self):
        self.db.financials_reported.create_index([("accessNumber", 1), ("symbol", 1)], unique=True)
        for item in self.symbols:
            symbol = item["symbol"]
            print(f"Downloading {symbol}")
            result = self.finnhub_client.financials_reported(symbol=symbol, freq='quarterly')
            if result != {} and result["data"] != []:
                try:
                    self.db.financials_reported.insert_many(result["data"])
                except BulkWriteError as bwe:
                    print(f"{self.get_financials_reported.__name__}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
                    continue
            else:
                print(f"{self.get_financials_reported.__name__}: Cannot insert {symbol} as the response is empty")
    
    def get_earnings_calendar(self):
        self.db.earnings_calendar.create_index([("date", 1), ("symbol", 1)], unique=True)
        for item in self.symbols:
            symbol = item["symbol"]
            print(f"Downloading {symbol}")
            result = self.finnhub_client.earnings_calendar(symbol=symbol)
            if result != {} and result["earningsCalendar"] != []:
                try:
                    self.db.earnings_calendar.insert_many(result["earningsCalendar"])
                except BulkWriteError as bwe:
                    print(f"{self.get_earnings_calendar.__name__}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
                    continue
            else:
                print(f"{self.get_earnings_calendar.__name__}: Cannot insert {symbol} as the response is empty")
    
    def get_candles(self):
        self.db.candles.create_index([("timestamp", 1), ("symbol", 1)], unique=True)
        for item in self.symbols:
            symbol = item["symbol"]
            print(f"Downloading {symbol}")
            current_timestamp = int(time.time())
            result = self.finnhub_client.stock_candles(symbol=symbol, resolution="D", _from=1260576000, to=current_timestamp)
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
                    print(f"{self.get_candles.__name__}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")
                    continue
            else:
                print(f"{self.get_candles.__name__}: Cannot insert {symbol} as the response is empty")

    def get_company_profile(self):
        self.db.company_profile.create_index([("symbol", 1), ("shareOutstanding", 1)], unique=True)
        data_list = []
        for item in self.symbols:
            symbol = item["symbol"]
            print(f"Downloading {symbol}")
            result = self.finnhub_client.company_profile2(symbol=symbol)
            if result != {}:
                data_list.append(result)
            else:
                print(f"{self.get_company_profile.__name__}: Cannot insert {symbol} as the response is empty")
        try:
            self.db.company_profile.insert_many(data_list) 
        except BulkWriteError as bwe:
            print(f"{self.get_company_profile.__name__}: BulkWrite - {symbol} - {bwe.details['writeErrors'][0]['errmsg']}")

    def get_technicals(self):
        pass

    def get_pattern_recognition(self):
        pass



