const config = require('./config');
const emoji = require('./emoji');
const img = require('./image');
const gradeSymbol = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'F'];
let undefined_reply = `抱歉，無法理解 ${emoji.sauropod}`;
let start = `歡迎使用NTU Course Bot ${emoji.rabbit} \n可以使用 /h 或 /help 查看相關功能`;
let help_messages = {
    main: `${emoji.lightbulb} 幫助 \n` +
        `/h 或 /help 顯示說明文件\n\n` +
        `${emoji.red_notebook} 課程查詢 \n/c [課程名稱] 或 /c [課程識別碼]\n\n` +
        `${emoji.graduation_cap} 系所\n` +
        `/d [科系] [甜度] [必/選修]\n\n` +
        `${emoji.palette} 教師\n` +
        `/t [教師名稱]\n\n` +
        ` {參數} \n` +
        `  -g [GPA] => GPA下限\n  -y [學期] => 指定學期\n`,
    course:  `${emoji.red_notebook} 課程查詢 \n/c [課程名稱] 或 /c [課程識別碼]\n` +
        `  -g [GPA] => GPA搜尋下限\n  -y [學期] => 指定學期\n  -s       => 照GPA排序\n\n` +
        `Ex: 106-2 平均GPA>3.5的 機器學習\n\n` +
        `/c 機器學習 -g 3.5 -y 106-2\n\n` +
        `${emoji.whale} 附註\n` +
        `預設學期為 ${config.settings.cyear} \n` +
        `搜尋回傳數目上限為40筆\n`,
    dept: `${emoji.graduation_cap} 系所 \n` +
        `/d [科系] [甜度] [必/選修]\n` +
        `  -g [GPA] => GPA搜尋下限\n  -y [學期] => 指定學期\n\n` +
        `[甜度]\n很甜: GPA >= 4\n甜:GPA >= 3.7\n不甜：GPA <= 3.2\n\n` +
        `[科系]\n 可使用中文或代號，例如電機 or EE\n\n` +
        `[範例]\n/d 電機 很甜 必修 -y 106-1\n/d IM 選修 不甜\n\n` +
        `${emoji.whale} 附註\n` +
        `預設學期為 ${config.settings.cyear} \n` +
        `搜尋回傳數目上限為40\n` +
        `隱藏專題研究課程` ,
    teacher:  `${emoji.palette} 教師\n` +
        `/t [教師名稱]\n` +
        `  -g [GPA] => GPA搜尋下限\n  -y [學期] => 指定學期\n\n` +
        `Ex: /t 孔令傑 -g 2.7\n\n` +
        `${emoji.whale} 附註\n` +
        `預設學期為 ${config.settings.cyear} \n` +
        `搜尋回傳數目上限為40筆`
}
const markdownCode = (str) => {
    return ('```\n' + str + '```')
}
const markdownLink = (text, link) => {
    return ('[' + text + '](' + link + ')')
}
const toPercentage = (num) => {
    return (num * 100).toFixed(0);
}

let accGPA = (course) => {
    let accGPA = '無GPA資料';
    if (course.AVGGPA >= 0) {
        accGPA = '';
        let a = 0;
        let b = 0;
        let c = 0;
        let f = 0;
        gradeSymbol.forEach((sym, idx) => {
            if (idx <= 2) {
                a += course[sym];
            } else if (idx <= 5) {
                b += course[sym];
            } else if (idx <= 8) {
                c += course[sym];
            } else {
                f += course[sym];
            }
        });
        let sum = a + b + c + f;
        accGPA += toPercentage(a / sum) + '/' + toPercentage(b / sum) + '/' + toPercentage(c / sum) + '/' + toPercentage(f / sum) + '%(A/B/C/F)';
    }
    return accGPA;

}

let courseAttrs = {
    card: (course) => {
        let courseObj = [
            ['教授', course.CPRO ],
            ['平均', course.AVGGPA >= 0 ? course.AVGGPA : "無資料"],
            ['時間', course.CTIME ],
            ['等第', course.accGPA],
            ['系所', course.CDEPNAME],
            ['班次', course.CLNUM]
        ];
        return courseObj;
    },
    text: (course) => {
        let courseObj = [
            ['學期', course.CYEAR],
            ['班次', course.CLNUM],
            ['課號', course.CONUM],
            ['教授', course.CPRO],
            ['系所', course.CDEPNAME],
            ['時間', course.CTIME],
            ['等第', course.accGPA],
            ['平均', course.AVGGPA >= 0 ? course.AVGGPA : "無資料"],
            ['學分', course.CREDIT],
            ['修課', course.CTYPE],
            ['人數', course.CLIMIT],
        ];
        return courseObj;
    }

} 

let course = {
    telegram: function (course) {
        let courseHeader = "";
        let courseInfo = "";
        course.accGPA = accGPA(course);
        if (course.AVGGPA >= 0) {
            courseHeader += `[ ${markdownLink(course.CNAME, course.CWEBURL)}] [[GPA ${course.AVGGPA}]]\n`;
        } else {
            course.AVGGPA = '無GPA資料';
            courseHeader += `[ ${markdownLink(course.CNAME, course.CWEBURL)}]\n`;
        }
        let courseObj = courseAttrs.text(course);
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
        course.accGPA = accGPA(course);
        let courseObj = courseAttrs.text(course);
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
            course.accGPA = accGPA(course);
            if (course.AVGGPA >= 0) {
                courseHeader += `[ ${course.CNAME}] [GPA ${course.AVGGPA}]\n`;
            } else {
                course.AVGGPA = '無GPA資料';
                courseHeader += `[ ${course.CNAME}]\n`;
            }
            let courseObj = courseAttrs.text(course);
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
                e.title = course.CNAME;
                course.accGPA = accGPA(course);
                let courseObj = courseAttrs.card(course);
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
                e.image_url = img.randomImg(img.gakki);
                elements.push(e);
            });
            return elements;
        },
        single: function (courses) {
            let elements = [];
            courses.forEach(course => {
                let e = {};
                e.title = course.CNAME;
                course.accGPA = accGPA(course);
                let courseObj = courseAttrs.card(course);
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
                e.image_url = img.randomImg(img.gakki);
                elements.push(e);
            });
            return elements;
        },
    }
};


let help = {
    telegram: (() => {
        let reply = {};
        reply.message = help_messages.main;
        reply.message = markdownCode(reply.message);
        let inline_keyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "課程",
                        callback_data: "QUERY_COURSE",
                    }, {
                        text: "系所",
                        callback_data: "QUERY_DEPT",
                    }, {
                        text: "教師",
                        callback_data: "QUERY_TCHR",
                    }, {
                        text: "更多",
                        callback_data: "GITHUB_PAYLOAD",
                    }]
                ],
            },
        }
        reply.inlineHeader = `以下為不同指令的詳細說明，可點擊參考`;
        reply.inline = inline_keyboard;
        return reply;
    })(),
    messenger: (() => {
        let reply = {};
        reply.message = help_messages.main;
        reply.quickreplyHeader = `以下為不同指令的詳細說明，可點擊參考`;
        reply.quickreply = {
            quick_replies: [{
                    content_type: 'text',
                    title: '課程',
                    payload: 'QUERY_COURSE',
                    image_url: img.icons.red_search

                },
                {
                    content_type: 'text',
                    title: '系所',
                    payload: 'QUERY_DEPT',
                    image_url: img.icons.bank
                },
                {
                    content_type: 'text',
                    title: '教師',
                    payload: 'QUERY_TCHR',
                    image_url: img.icons.book
                },
                {
                    content_type: 'text',
                    title: '更多',
                    payload: 'GITHUB_PAYLOAD',
                    image_url: img.icons.github
                }
            ],
        };
        return reply;

    })()


}
let command_info = {
    course: {
        telegram: (() => {
            let reply = {};
            reply.message = help_messages.course;
            let tglimit = config.settings.cnumlimit.telegram.toString();
            let messglimit = config.settings.cnumlimit.messenger.toString();
            reply.message = reply.message.replace(messglimit, tglimit);
            reply.message = markdownCode(reply.message);
            return reply;
        })(),
        messenger: (() => {
            let reply = {};
            reply.message = help_messages.course;
            reply.quickreplyHeader = `以下為更多示範，可點擊參考`;
            reply.quickreply = {
                quick_replies: [{
                        content_type: 'text',
                        title: '查詢課程',
                        payload: 'FB_QUERY_COURSE_EXAMPLE1',
                        image_url: img.icons.red_search

                    },
                    {
                        content_type: 'text',
                        title: '課程識別碼',
                        payload: 'FB_QUERY_COURSE_EXAMPLE2',
                        image_url: img.icons.yellow_search
                    }
                ],
            };
            return reply;
        })(),

    },
    dept: {
        telegram: (() => {
            let reply = {};
            reply.message = help_messages.dept;
            reply.message = markdownCode(reply.message);
            return reply;
        })(),
        messenger: (() => {
            let reply = {};
            reply.message = help_messages.dept;
            return reply;
        })()
    },
    teacher: {
        telegram: (() => {
            let reply = {};
            reply.message = help_messages.teacher;
            reply.message = markdownCode(reply.message);
            return reply;
        })(),
        messenger: (() => {
            let reply = {};
            reply.message = help_messages.teacher;
            return reply;
        })(),
    }
}

const more_info = {
    messenger: [{
        title: "NTU Course Bot",
        image_url: config.github.img,
        subtitle: '不同平台說明和documentation',
        default_action: {
            type: 'web_url',
            url: config.github.url,
            messenger_extensions: true,
            webview_height_ratio: 'tall',
            fallback_url: config.github.url,
        },
        buttons: [{
            type: 'web_url',
            url: config.github.url,
            title: 'Github'
        },{
            type: 'web_url',
            url: config.telegram.url,
            title: 'Telegram'
        }]
    }],
}

module.exports = {
    course: course,
    start: start,
    help: help,
    undefined_reply: undefined_reply,
    command_info: command_info,
    more_info: more_info
}