const command =  require('./command');
const config = require('./config');
const ms = require('minimist-string');

const getAction = function(text){
    // let messages = text.split(" ");
    const args = ms(text);
    console.log(args);
    let action = {
        cmd: -1,
        name : 'undefined',
        argv: []
    };
    /* get command type */
    let cmd = args._[0].toString().toLowerCase();
    for(let i = 0; i < command.commands_list.length; ++i){
        if(command.commands_list[i].alias.includes(cmd)){
            action.cmd = command.commands_list[i].code;
            action.name = command.commands_list[i].name;
            
            break;
        }
    }
    
    /* COURSE COMMAND */
    if(action.cmd == command.commands_code.COURSE){
        /* year argument */
        let year = args.y;
        
        if(year){
            year = year.toString();
            if(year.length >= 4){
                year = year.replace(/D/g, '');
                year = year.substring(0,3) + '_' + year[year.length-1];
            }
            else{
                year = config.settings.cyear;
            }
        }
        action.course_year = year ? year : config.settings.cyear;

        /* gpa argument */
        action.course_gpa = args.g ? args.g : -99;
        
        /* sort argument */
        action.sort = args.s ? args.s : 0;

        /* test for user searches for CNAME or CUID */
        let course = args._.slice(1, args._.length).join(" ");
        let regex = /^[A-Za-z0-9 ]+$/;
        action.argv.push(course);  
        action.course_type = (regex.test(course) && course.length == 9 && /\d/.test(course[course.length-1])) ? 0 : 1;      
    }
    /* DEPARTMENT COMMAND */
    else if(action.cmd == command.commands_code.DEPT){
        /* year argument */
        let year = args.y;
        if(year){
            year = year.toString();
            if(year.length >= 4){
                year = year.replace(/D/g, '');
                year = year.substring(0,3) + '_' + year[year.length-1];
            }
            else{
                year = config.settings.cyear;
            }
        }
        action.course_year = year ? year : config.settings.cyear;

        action.dept_name = "";
        for(let i = 0; i < args._.length; ++i){
            if(i == 0) continue;
            if(i == 1) action.dept_name = args._[i];
            else{
                action.argv.push(args._[i]);
            }
        }
        let regex = /^[A-Za-z0-9 ]+$/;
        action.dept_type = regex.test(action.dept_name) ? 0 : 1; 
        /* GPA Constraint: 1 -> above,  0 -> below*/
        action.gpa_above = 1;
        for(let i = 0; i < action.argv.length; ++i){
            /* 甜度調查 */
            if(action.argv[i].includes('很甜')){
                action.course_gpa = 4;
            }
            else if(action.argv[i].includes('甜') && !action.argv[i].includes('不')){
                action.course_gpa = 3.7;
            }
            else if(action.argv[i].includes('不甜')){
                action.course_gpa = 3.2;
                action.gpa_above = 0;
            }

            /* 必/選 修*/
            action.course_type = 0;
            if(action.argv[i].includes('必修')){
                action.course_sub_type = 1;
            }
            if(action.argv[i].includes('選修')){
                action.course_sub_type = 2;
            }
            if(action.argv[i].includes('必帶')){
                action.course_sub_type = 3;
            }

        }

        /* gpa argument */
        if(!action.course_gpa){
            action.course_gpa = args.g  ? args.g : -99;
        }
        if(args.g){ action.gpa_above = 1;}

        
        
    }

    /* TEACHER COMMAND */
    else if(action.cmd == command.commands_code.TEACHER){
        action.tchr_name = "";
        for(let i = 0; i < args._.length; ++i){
            if(i == 0) continue;
            if(i == 1) action.tchr_name = args._[i];
        }

        /* year argument */
        let year = args.y;
        if(year){
            year = year.toString();
            if(year.length >= 4){
                year = year.replace(/D/g, '');
                year = year.substring(0,3) + '_' + year[year.length-1];
            }
            else{
                year = config.settings.cyear;
            }
        }
        action.course_year = year ? year : config.settings.cyear;

         /* gpa argument */
         action.course_gpa = args.g ? args.g : -99;
        
    }
    

    return action;
}

module.exports = {
    getAction: getAction
}