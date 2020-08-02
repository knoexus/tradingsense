import requests
from lxml.html import fromstring
import time

def get_proxies(delay=0):
    if delay > 0:
        time.sleep(delay)
    start_delay = 30
    number_of_proxies = 20 # max 20 per page
    url = 'https://free-proxy-list.net/'
    response = requests.get(url)
    parser = fromstring(response.text)
    proxies = set()
    for i in parser.xpath('//tbody/tr')[:number_of_proxies]:
        if i.xpath('.//td[7][contains(text(),"yes")]'):
            proxy = ":".join([i.xpath('.//td[1]/text()')[0], i.xpath('.//td[2]/text()')[0]])
            proxies.add(proxy)
    if len(proxies) == 0:
        print("No proxies found currently")
        return get_proxies(delay=start_delay+delay)
    else:
        return proxies