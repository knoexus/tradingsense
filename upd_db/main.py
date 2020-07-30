import os
import pandas as pd
import datetime
from finnhub import Client as FinnhubClient
from pymongo import MongoClient
import dns
import requests
import json

# local
import proxy
import side

proxies = {}

mongo_client = MongoClient(f'mongodb+srv://{os.environ["MONGODB_USERNAME"]}:{os.environ["MONGODB_PASSWORD"]}@cluster0.hqaye.mongodb.net/{os.environ["MONGODB_DB_NAME"]}?retryWrites=true&w=majority&ssl_cert_reqs=CERT_NONE')
db = mongo_client[os.environ["MONGODB_DB_NAME"]]
db.recommendation_trends.create_index([("period", 1), ("symbol", 1)], unique=True)

finnhub_client = FinnhubClient(api_key=os.environ['FINNHUB_API_KEY'])

raw_symbols = requests.get(f"https://finnhub.io/api/v1/stock/symbol?exchange=US&token={os.environ['FINNHUB_API_KEY']}")
symbol_list = list(filter(side.filter_symbol, json.loads(raw_symbols.content)))

side.get_recommendation_trends(symbol_list[:10], finnhub_client, db.recommendation_trends)

# # res = finnhub_client.stock_candles('AAPL', 'D', 1590988249, 1591852249)
# recommendation_trends.insert_many(res)
# print('\n'.join([datetime.datetime.fromtimestamp(date).strftime('%Y-%m-%d') for date in res['t']]))
