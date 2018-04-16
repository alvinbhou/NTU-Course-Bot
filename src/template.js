const config = require('./config');

const gradeSymbol = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'F'];
const markdownCode = (str) => {
    return ('```\n' + str + '```')
}
const markdownLink = (text, link) => {
    return ('[' + text + '](' + link + ')')
}

const toPercentage = (num) => {
    return (num * 100).toFixed(0);
}

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
        let courseHeader = `[${course.CNAME}]\n`;
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

module.exports = {
    course: course
}