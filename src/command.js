const commands_list = [
    {
        name: 'help',
        alias: ['/h', '/help', 'help'],
        code: 0
    },
    {
        name: 'course',
        alias: ['/c', '/cousrse'],
        code: 1,
        course_type:{
            'CNAME': 1,
            'CUID': 0
        }
    },
    {
        name: 'department',
        alias: ['/d', '/dept', '/department'],
        code: 2
    },
    {
        name: 'start',
        alias: ['/start'],
        code: 200
    }
   
]

const commands_code ={
    HELP: 0,
    COURSE: 1,
    DEPT: 2,
    START: 200,
    UNDEFINED: -1
}

module.exports = {
    commands_code: commands_code,
    commands_list: commands_list
}