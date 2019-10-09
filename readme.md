# NTU Course Bot

台大課程機器人，可查甜課資訊，不同系所和教授課程

> 想修財務管理，不知道哪個班最甜？
> 大CS時代想電資選修，但又怕GPA太低？

透過 NTU Course Bot 查詢課程，課程按照GPA排序並連結台大課程網，也提供查詢不同系所的課程

NTU Course Bot gives course information based on GPA, departments and more.

You can set your desired grade average for courses, and find the best courses in each department. Search through courses for a specifc professor. Futhermore, you can connect to the official course information site with just a click.

## Chat with the bot
### Messenger
https://m.me/ntucoursebot

### Telegram
https://t.me/ntucoursebot

### Line
https://line.me/R/ti/p/neIdhdWSlX

## Demo Video
<div align="center">
  <a href="https://youtu.be/TTzZ3ProM4c"><img src="https://img.youtube.com/vi/TTzZ3ProM4c/0.jpg" alt="ntucoursebot demo vid"></a>
</div>

## Documentation
### Help

```
💡 Help
help or /help to show the help message

💡 幫助 
help 或 /help 顯示說明文件
```

### 課程查詢 (course)
```
📕 Query for finding a course
Example:
  "Machine Learning"
  "725 M2410"
  
Advanced:
/c [course name|course number] -g [GPA] -y [semester]

📕 課程查詢 
⊕基本操作
輸入課名或課程識別碼
※範例
  『機器學習』
  『725 M2410』

⊕進階操作
/c [課程名稱] 或 /c [課程識別碼] 配上參數
  -g [GPA] => GPA搜尋下限
  -y [學期] => 指定學期

※範例： 106-2 平均GPA>3.5的 機器學習

/c 機器學習 -g 3.5 -y 106-2

🐳 附註
預設學期為 106_2 
搜尋回傳數目上限為40筆，按GPA排序
```

### 系所查詢 (department)
```
🎓 Query for finding a course on a specific department
Example:
  "EE Foundation"
  "EE Elective HighGPA"
  "IM Depth LowGPA"
  
Advanced:
  /d [dept] [high/low gpa] [elective|depth|foundation]
  -g [gpa]
  -y [semester]

🎓 系所 
⊕基本操作
輸入系所名稱/代號，選/必修，以及甜度(以空格隔開)
※範例
  『電機工程學系 必修』
  『電機系 選修 很甜』
  『IM 必帶 不甜』
  『7050 選修 甜』

⊕進階操作
/d [科系] [甜度] [必/選修] 配上參數
  -g [GPA] => GPA搜尋下限
  -y [學期] => 指定學期

※範例
  『/d 資管系 選修 很甜 -y 106-1』
  『/d 7050 選修 -g 3.5』

[甜度]
很甜: GPA >= 4
甜:GPA >= 3.7
不甜：GPA <= 3.2

[科系]
 可使用中英文或代號，例如電機系 or EE or 9010

🐳 附註
預設學期為 106_2 
搜尋回傳數目上限為40筆，按GPA排序
隱藏專題研究課程
```

### 教授查詢 (professor)
```
🎨 Query for finding courses of a professor
Example:
  "Teacher lckung"
  
🎨 教師
⊕基本操作
輸入『師』+ 教師名稱
※範例
  『師 孔令傑』

⊕進階操作
師 [教師名稱] 配上參數
  -g [GPA] => GPA搜尋下限
  -y [學期] => 指定學期

※範例
  『師 孔令傑 -g 2.7』

🐳 附註
預設學期為 106_2 
搜尋回傳數目上限為40筆，按GPA排序
```

### Reference
[課程資料](data/ntucourse.csv)來源為[NTU Sweety Course](https://ntusweety.herokuapp.com/)

[系所代號](data/departments.csv)來源為[國立台灣大學教務處](http://www.aca.ntu.edu.tw/curri/curs_deptabb.asp)
