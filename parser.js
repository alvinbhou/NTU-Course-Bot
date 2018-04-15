const command =  require('./command');
const ms = require('minimist-string');

const getAction = function(text){
    let messages = text.split(" ");
    const args = ms(text);
    console.log(args);
    let action = {
        cmd: -1,
        name : 'undefined',
        argv: []
    };
    /* get command type */
    let cmd = args._[0].toLowerCase();
    for(let i = 0; i < command.commands_list.length; ++i){
        if(command.commands_list[i].alias.includes(cmd)){
            action.cmd = command.commands_list[i].code;
            action.name = command.commands_list[i].name
            break;
        }
    }
    
    /* COURSE COMMAND */
    if(action.cmd == command.commands_code.COURSE){
        let year = args.y;
        if(year){
            if(year.length >= 4){
                year = year.replace(/D/g, '');
                year = year.substring(0,3) + '_' + year[year.length-1];
            }
        }
        action.course_year = year;
        /* test for user searches for CNAME or CUID */
        let course = args._.slice(1, args._.length).join(" ");
        let regex = /^[A-Za-z0-9 ]+$/;
        action.argv.push(course);        
        if(regex.test(course)){
            action.course_type = 0;
        }
        else{
            action.course_type = 1;
        }
    }
    /* DEPARTMENT COMMAND */
    else if(action.cmd = command.commands_code.DEPT){
        let argv = [];
        for(var i = 1; i < messages.length; ++i){
            argv.push(messages[i]);
        }
        action.argv = argv;
    }

   

    return action;
}

module.exports = {
    getAction: getAction
}