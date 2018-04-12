# coding=UTF-8
from bs4 import BeautifulSoup
from urllib.request import urlopen
import re
import csv, os, sys

if len(sys.argv) < 2:
    print("[Usage] python crawl_gpa.py [semester]")
    exit(1)

semester = sys.argv[1]
DATA_DIR = 'data'
BASE_URL = 'https://ntusweety.herokuapp.com'
gpa = [0.0, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0, 4.3]

with open( os.path.join(DATA_DIR , semester + '.csv'), newline='', encoding = "UTF-8") as csvfile:
    coursereader = csv.reader(csvfile, delimiter=';') 
    with open(semester + '_gpa.csv', 'a', newline='', encoding = "UTF-8") as gpafile:
        courseriter = csv.writer(gpafile, delimiter=',')
        for cidx, c in enumerate(coursereader):
            print(cidx)
            if len(c) != 16:
                print(c)
            gpa_url = c[-1]
            page = urlopen(BASE_URL + gpa_url)
            soup = BeautifulSoup(page,"html.parser")
            table = soup.find('table',{'id': 'history-table'})
            
            # no gpa record
            if not table:
                continue
            
            trs = table.findAll('tr', {'class': 'item'})
            gpa_record = [0] * 10
            for tr in trs:
                tds = tr.findAll('td')
                for idx, td in enumerate(tds):
                    if idx < 2:
                        continue
                    gpa_record[idx-2] += int(td.getText())

            weighted_sum = 0
            for idx, gpa_score in enumerate(gpa_record):
                weighted_sum += gpa_record[idx] * gpa[idx]
            avg_gpa = 0
            if sum(gpa_record) > 0:
                avg_gpa = round(weighted_sum / sum(gpa_record), 3)
            result = [ c[5], c[2]] + gpa_record + [avg_gpa]
            courseriter.writerow(result)
        