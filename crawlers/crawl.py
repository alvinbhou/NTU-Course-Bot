# coding=UTF-8
from bs4 import BeautifulSoup
from urllib.request import urlopen
import re, sys, os

if len(sys.argv) < 3:
    print("[Usage] python crawl.py [semester] [pages]")
    exit(1)
SEMESTER = sys.argv[1]
PAGES = int(sys.argv[2])

for pageNum in range(0,PAGES):
    page = urlopen("http://ntusweety.herokuapp.com/search?m=0&m=1&m=2&m=3&m=4&m=5&m=6&m=7&m=8&m=9&m=10&m=A&m=B&m=C&m=D&t=0&t=1&t=2&t=3&t=4&t=5&t=6&t=7&t=8&t=9&t=10&t=A&t=B&t=C&t=D&w=0&w=1&w=2&w=3&w=4&w=5&w=6&w=7&w=8&w=9&w=10&w=A&w=B&w=C&w=D&h=0&h=1&h=2&h=3&h=4&h=5&h=6&h=7&h=8&h=9&h=10&h=A&h=B&h=C&h=D&f=0&f=1&f=2&f=3&f=4&f=5&f=6&f=7&f=8&f=9&f=10&f=A&f=B&f=C&f=D&s=0&s=1&s=2&s=3&s=4&s=5&s=6&s=7&s=8&s=9&s=10&s=A&s=B&s=C&s=D&sem=" +SEMESTER +"&faculty=&depart=&name=&teacher=&page=" + str(pageNum))
    soup = BeautifulSoup(page,"html.parser")
    data = []
    table = soup.find('table',{'class': 'table'})
    for row in table.findAll("tr"):
        cols = row.findAll("td")
        gpa_url = ""
        course_url = ""
        if(len(cols) == 18):
            for link in cols[4].findAll('a', href=True):
                gpa_url = link['href']
                # print(gpa_url)
                break
            for link in cols[16].findAll('a', href=True):
                course_url = link['href']
                # print(course_url)
                break
        else:
            print(cols)
            continue
        cols = [ele.text.replace(';\n', '') for ele in cols]
        cols[15] = course_url
        cols[16] = gpa_url
        # drop useless column
        cols[1] = cols[0]
        cols = cols[1:-1]
        if len(cols) != 16:
            print(cols)
        
        data.append(cols)
    print("Page",pageNum)
    with open(SEMESTER + ".csv", "a", encoding = "UTF-8") as f:
        for d in data:
            info = ''
            for idx, s in enumerate(d):
                if(idx > 16):
                    break
                info += s +';'
            f.write(info[:-1] + '\n')
