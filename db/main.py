import os
from finnhub import Client as FinnhubClient
from pymongo import MongoClient
import dns
# local
import db as dbops

mongo_client = MongoClient(f'mongodb+srv://{os.environ["MONGODB_USERNAME"]}:{os.environ["MONGODB_PASSWORD"]}@cluster0.hqaye.mongodb.net/{os.environ["MONGODB_DB_NAME"]}?retryWrites=true&w=majority&ssl_cert_reqs=CERT_NONE')
db = mongo_client[os.environ["MONGODB_DB_NAME"]]

finnhub_client = FinnhubClient(api_key=os.environ['FINNHUB_API_KEY'])

dataOps = dbops.DataOps(finnhub_client, db, 100)
dataOps.call_all_authed()
