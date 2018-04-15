const config = require('./bottender.config');

const gradeSymbol = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C','C-', 'F'];
const markdownCode = (str) => {return ('```\n'+str+'```')}
const markdownLink = (text, link) => {return ('[' + text +'](' + link + ')')}
const course = {
    telegram: function (course, channel) {
        if (channel == config.constant.CHANNEL.TG) {
            let courseHeader = "";
            courseHeader += '[' + markdownLink(course.CNAME, course.CWEBURL) + ']\n';
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
            } else {
                course.AVGGPA = '無GPA資料';
            }
            let courseObj = [
                ['學期', course.CYEAR],
                ['班次', course.CLNUM],
                ['課號', course.CONUM],
                ['教授', course.CPRO],
                ['時間', course.CTIME],
                ['等第', accGPA],
                ['GPA', course.AVGGPA],
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
        }
    }

};

module.exports = {
  course:  course
}