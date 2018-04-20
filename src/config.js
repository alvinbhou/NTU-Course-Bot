module.exports = {
  settings:{
    cyear: '106_2',
    cnumlimit: 20,
    cawaitnumlimit: 10
  },
  constant:{
    PLATFORM: {
      TG: 'telegram',
      LINE: 'line',
      MESSG: 'messenger'
    },
    STRING:{
      NOCLASSNUM: '%NOCLNUM%',

      QUERY_COURSE: '/c',
      QUERY_DEPT: '/d',
      QUERY_TCHR: '/t'

    },
    EXAMPLES:{
      COURSE: {
        TG_QUERY_COURSE_EXAMPLE1: '/c 演算法 -g 3.6 -y 106-1 -s',
        TG_QUERY_COURSE_EXAMPLE2: '/c 725 M2410',
        FB_QUERY_COURSE_EXAMPLE1: '/c 機器學習 -g 3.5',
        FB_QUERY_COURSE_EXAMPLE2: '/c 725 M2410',
      },
      DEPT:{
        FB_QUERY_DEPT_EXAMPLE: '/d 資管所 甜課 選修',
        TG_QUERY_DEPT_EXAMPLE: '/d 資管所 甜課 選修',
      }
      
    
    },
    NUMBER:{

    },
  },
  payload:{
    GET_STARTED: 'GET_STARTED_PAYLOAD',
    QUERY_COURSE: 'QUERY_COURSE',
    QUERY_DEPT: 'QUERY_DEPT',
    QUERY_TCHR: 'QUERY_TCHR',
    GITHUB_PAYLOAD: 'GITHUB_PAYLOAD'
  },
  whitelist: ['課程', '系所', '教師'],
  github:{
    img: 'https://cryolitez.github.io/images/me.jpg',
    url: 'https://github.com/CryoliteZ/NTU-Course-Bot',
  }

};