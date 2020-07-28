import os
import pandas as pd
import datetime
from finnhub import Client as FinnhubClient
from pymongo import MongoClient
import dns

finnhub_client = FinnhubClient(api_key=os.environ['FINNHUB_API_KEY'])

mongo_client = MongoClient(f'mongodb+srv://{os.environ["MONGODB_USERNAME"]}:{os.environ["MONGODB_PASSWORD"]}@cluster0.hqaye.mongodb.net/{os.environ["MONGODB_DB_NAME"]}?retryWrites=true&w=majority&ssl_cert_reqs=CERT_NONE')
db = mongo_client[os.environ["MONGODB_DB_NAME"]]
stock_data = db.stock_data

res = finnhub_client.stock_candles('AAPL', 'D', 1590988249, 1591852249)

print('\n'.join([datetime.datetime.fromtimestamp(date).strftime('%Y-%m-%d') for date in res['t']]))
