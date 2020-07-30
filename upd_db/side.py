def filter_symbol(x):
    if x["type"] == "EQS":
        return 1
    else:
        return 0

def get_recommendation_trends(symbols, finnhub_client, collection):
    for item in symbols:
        symbol = item["symbol"]
        print(f"Downloading {symbol}")
        result = finnhub_client.recommendation_trends(symbol)
        if result != []:
            collection.insert_many(result)
        else:
            print(f"Cannot insert {symbol} as the list is empty")
