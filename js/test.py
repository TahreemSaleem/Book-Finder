import urllib.request
url = 'https://www.goodreads.com/search.xml?key=o3ZEitH9EZ1E7JYpQ6BHHQ&q=Ender%27s+Game';

contents = urllib.request.urlopen(url).read()