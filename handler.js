const config = require('./config');
const parser = require('./parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data/ntucourse.db');
const command = require('./command');
const template = require('./template');
const sqlCPrefix = (str) => {return ('%'+str+'%')}

const handler = async context => {
  	/* text event */
	let reachLimitFlag = false;
	if (context.event.isText) {
		const text = context.event.text;
		let action = parser.getAction(text);
		console.log(action);
		switch(action.cmd){
			case command.commands_code.COURSE:
				let query_target = action.course_type ? 'CNAME' : 'CUID';
				let sql =  `SELECT * FROM course
							WHERE ${query_target} LIKE ? AND
							CYEAR = ? AND
							AVGGPA >= ?
							ORDER BY AVGGPA DESC`;	
				
				db.all(sql, [sqlCPrefix(action.argv[0]), action.course_year, action.course_gpa], (err, rows) => {
					if (err) {
						throw err;
					}
					console.log('courses length:',rows.length);
					( async() => {
						for(let i = 0; i < rows.length; ++i){
							let row = rows[i];
							if(row.CLNUM == config.constant.STRING.NOCLASSNUM){row.CLNUM = '無班次'};
							console.log(row.CYEAR, row.CNAME, row.CLNUM, row.CPRO, row.CREDIT, row.CTYPE,row.AVGGPA);
							let reply = template.course.telegram(row,context.platform);
							/* sort as descending order or not */
							if(action.sort){
								await context.sendMessage( reply, {parse_mode:'Markdown'});
								/* to prevent await too long */
								if(i > config.settings.cawaitnumlimit){
									reachLimitFlag = true;
									break;
								}
							}
							else{
								context.sendMessage( reply, {parse_mode:'Markdown'});
							}
							if(i > config.settings.cnumlimit){
								reachLimitFlag = true;
								break;
							}
						}
					}
					)();
				});
				break;
		}

	}
	if(reachLimitFlag){
		await context.sendText(`🐳 搜尋結果數達到上限，或許可以將搜尋範圍縮小 🐳`);
	}
	
};

module.exports = handler;