const config = require('./config');
const emoji = require('./emoji');
const gradeSymbol = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'F'];
const markdownCode = (str) => { return ('```\n' + str + '```')}
const markdownLink = (text, link) => { return ('[' + text + '](' + link + ')')}
const toPercentage = (num) => { return (num * 100).toFixed(0);}

const course = {
    telegram: function (course) {
        let courseHeader = "";
        let courseInfo = "";
        let accGPA = '無GPA資料';
        if (course.AVGGPA >= 0) {
            accGPA = '';
            gradeSymbol.forEach((sym, idx) => {
                accGPA += course[sym];
                if (idx != gradeSymbol.length - 1) {
                    accGPA += '|';
                }
            });
            accGPA += ' (A~F)';
            courseHeader += `[ ${markdownLink(course.CNAME, course.CWEBURL)}] [[GPA ${course.AVGGPA}]]\n`;
        } else {
            course.AVGGPA = '無GPA資料';
            courseHeader += `[ ${markdownLink(course.CNAME, course.CWEBURL)}]\n`;

        }
        let courseObj = [
            ['學期', course.CYEAR],
            ['班次', course.CLNUM],
            ['課號', course.CONUM],
            ['教授', course.CPRO],
            ['時間', course.CTIME],
            ['等第', accGPA],
            ['平均', course.AVGGPA],
            ['學分', course.CREDIT],
            ['修課', course.CTYPE],
            ['人數', course.CLIMIT],
            ['限制', course.CCSTR]
        ];
        courseObj.forEach(c => {
            courseInfo += c[0] + ' \t: ' + c[1] + '\n';
        });
        courseInfo = markdownCode(courseInfo);
        let reply = courseHeader + courseInfo;
        return reply;
    },
    line: function (course) {
        let courseHeader = `[${course.CNAME}] [GPA ${course.AVGGPA}]\n`;
        let courseInfo = "";
        let accGPA = '無GPA資料';
        if (course.AVGGPA >= 0) {
            accGPA = '';
            gradeSymbol.forEach((sym, idx) => {
                accGPA += course[sym];
                if (idx != gradeSymbol.length - 1) {
                    accGPA += '|';
                }
            });
            accGPA += ' (A~F)';
        }
        let courseObj = [
            ['學期', course.CYEAR],
            ['班次', course.CLNUM],
            ['課號', course.CONUM],
            ['教授', course.CPRO],
            ['時間', course.CTIME],
            ['等第', accGPA],
            ['平均', course.AVGGPA],
            ['學分', course.CREDIT],
            ['修課', course.CTYPE],
            ['人數', course.CLIMIT],
            ['限制', course.CCSTR],
        ];
        courseObj.forEach(c => {
            courseInfo += c[0] + ' \t: ' + c[1] + '\n';
        });
        let reply = courseHeader + courseInfo;
        return reply;
    },
    messenger: {
        multi: function (course) {
            let courseHeader = "";
            let courseInfo = "";
            let accGPA = '無GPA資料';
            if (course.AVGGPA >= 0) {
                accGPA = '';
                gradeSymbol.forEach((sym, idx) => {
                    accGPA += course[sym];
                    if (idx != gradeSymbol.length - 1) {
                        accGPA += '|';
                    }
                });
                accGPA += ' (A~F)';
                courseHeader += `[ ${course.CNAME}] [GPA ${course.AVGGPA}]\n`;
            } else {
                course.AVGGPA = '無GPA資料';
                courseHeader += `[ ${course.CNAME}]\n`;
    
            }
            let courseObj = [
                ['學期', course.CYEAR],
                ['班次', course.CLNUM],
                ['課號', course.CONUM],
                ['教授', course.CPRO],
                ['時間', course.CTIME],
                ['等第', accGPA],
                ['平均', course.AVGGPA],
                ['學分', course.CREDIT],
                ['修課', course.CTYPE],
                ['人數', course.CLIMIT],
                ['限制', course.CCSTR],
            ];
            courseObj.forEach(c => {
                courseInfo += c[0] + ' : ' + c[1] + '\n';
            });
            let reply = courseHeader + courseInfo;
            return reply;
        },
        list: function (courses) {
            let elements = [];
            courses.forEach(course => {
                let e = {};
                if (course.CLNUM == config.constant.STRING.NOCLASSNUM) {
                    course.CLNUM = '無班次'
                };
                e.title = course.CNAME;
                let accGPA = '無GPA資料';
                if (course.AVGGPA >= 0) {
                    accGPA = '';
                    gradeSymbol.forEach((sym, idx) => {
                        accGPA += course[sym];
                        if (idx != gradeSymbol.length - 1) {
                            accGPA += '|';
                        }
                    });
                    accGPA += ' (A~F)';
                }
                let courseObj = [
                    ['教授', course.CPRO],
                    ['平均', course.AVGGPA >= 0 ? course.AVGGPA : "無資料"],
                    ['時間', course.CTIME],
                ];
                let courseInfo = "";
                courseObj.forEach(c => {
                    courseInfo += c[0] + ' \t: ' + c[1] + '\n';
                });
                e.subtitle = courseInfo;
                e.default_action = {
                    type: 'web_url',
                    url: course.CWEBURL,
                    messenger_extensions: true,
                    webview_height_ratio: 'tall',
                    fallback_url: course.CWEBURL,
                };
                if(Math.random() > 0.5){
                    e.image_url = "https://i.imgur.com/ryrS1Aw.jpg";
                }
                else{
                    e.image_url = "https://i.imgur.com/parFegj.jpg";
                }
                elements.push(e);
            });
            return elements;
        },
        single: function (courses) {
            let elements = [];
            courses.forEach(course => {
                let e = {};
                if (course.CLNUM == config.constant.STRING.NOCLASSNUM) {
                    course.CLNUM = '無班次'
                };
                e.title = course.CNAME;
                let accGPA = '無GPA資料';
                if (course.AVGGPA >= 0) {
                    accGPA = '';
                    let a = 0;
                    let b = 0;
                    let c = 0;
                    let f = 0;
                    gradeSymbol.forEach((sym, idx) => {
                        if(idx <= 2){
                            a += course[sym];
                        }
                        else if(idx <= 5){
                            b += course[sym];
                        }
                        else if(idx <= 8){
                            c += course[sym];
                        }
                        else{
                            f += course[sym];
                        }
                    });
                    let sum = a + b + c +f;
                    // accGPA +=  toPercentage(a/sum) +'/' + toPercentage(b/sum) +'/' + toPercentage(c/sum) +'/'+ toPercentage(f/sum) + ' (A/B/C/F) %';
                    accGPA +=  a +'/' + b +'/' + c +'/'+ f + ' (A/B/C/F)';
                }
                let courseObj = [
                    ['教授', course.CPRO],
                    ['平均', course.AVGGPA >= 0 ? course.AVGGPA : "無資料"],
                    ['時間', course.CTIME],
                    ['等第', accGPA],                    
                    ['人數', course.CLIMIT],
                ];
                let courseInfo = "";
                courseObj.forEach(c => {
                    courseInfo += c[0] + ' \t: ' + c[1] + '\n';
                });
                e.subtitle = courseInfo;
                e.default_action = {
                    type: 'web_url',
                    url: course.CWEBURL,
                    messenger_extensions: true,
                    webview_height_ratio: 'tall',
                    fallback_url: course.CWEBURL,
                };
                if(Math.random() > 0.5){
                    e.image_url = "https://i.imgur.com/ryrS1Aw.jpg";
                }
                else{
                    e.image_url = "https://i.imgur.com/parFegj.jpg";
                }
                elements.push(e);
            });
            return elements;
        },
       

    }
};


const start = `歡迎使用NTU Course Bot ${emoji.rabbit} \n可以使用 /h 或 /help 查看相關功能`;
const help = {
    telegram: () =>{
        let reply = {};
        reply.message =  `『幫助』 \n` +
        `/h 或 /help 顯示說明文件\n\n` +
        `『課程查詢』 \n/c [課程名稱] 或 /c [課程流水號]\n` +
        `\t\t-選項\n\t\t-g [GPA] => 設定GPA搜尋下限\n\t\t-y [學期] => 指定特定學期\n\t\t-s       => 是否按照GPA排序\n\n` +
        `『系所』\n` +
        `/d [科系] [甜度] [必/選修]\n` +
        `\t\t-選項\n\t\t-g [GPA] => 設定GPA搜尋下限\n\t\t-y [學期] => 指定特定學期`;
        
        reply.message = markdownCode(reply.message);
        let inline_keyboard = 
        {
            reply_markup: {
                inline_keyboard: [[{
                    text: "查詢課名範例",
                    callback_data: "TG_QUERY_COURSE_EXAMPLE1",
                },{
                    text: "課程流水號範例",
                    callback_data: "TG_QUERY_COURSE_EXAMPLE2",
                },{
                    text: "查詢系所範例",
                    callback_data: "TG_QUERY_DEPT_EXAMPLE",
                }]],
            },
        }
        reply.inlineHeader = `以下為不同指令的示範，可點擊參考`;
        reply.inline = inline_keyboard;
        return reply;
    }
            
    
}
module.exports = {
    course: course,
    start: start,
    help: help
}