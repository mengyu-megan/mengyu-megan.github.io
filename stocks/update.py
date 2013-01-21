import urllib2

stocks = [x.strip() for x in file('sp500.txt').readlines()]
for s in stocks:
    # crawl data
    url = 'http://chartapi.finance.yahoo.com/instrument/1.0/{0}/chartdata;type=quote;ys=2012;yz=1/csv'.format(s)
    r = urllib2.urlopen(url)
    html = r.read().split()
    dat = [x.split(',')[1] for x in html[15:]]
    if len(dat) != 263:
        continue
    f = file('{0}.txt'.format(s), 'w')
    f.write('\n'.join(dat))
    f.close()
    print s, len(dat)
