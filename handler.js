const config = require('./bottender.config');
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
		switch(action.cmd){
			case command.commands_code.COURSE:
				let sql;
				if(action.course_type == 1){
					if(action.course_year){
						sql = `SELECT * FROM course
							WHERE CNAME LIKE ? AND
							CYEAR = ?
							ORDER BY AVGGPA DESC`;	
					}
					else{
						sql = `SELECT * FROM course
							WHERE CNAME LIKE ?
							ORDER BY AVGGPA DESC`;	
					}							
					
				}
				else if(action.course_type == 0){
					if(action.course_year){
						sql = `SELECT * FROM course
							WHERE CUID LIKE ? AND
							CYEAR = ?
							ORDER BY AVGGPA DESC`;	
					}
					else{
						sql = `SELECT * FROM course
							WHERE CUID LIKE ?
							ORDER BY AVGGPA DESC`;	
					}
					
				}
				db.all(sql, [sqlCPrefix(action.argv[0]), action.course_year], (err, rows) => {
					if (err) {
						throw err;
					}
					( async() => {
						for(let i = 0; i < rows.length; ++i){
							let row = rows[i];
							if(row.CLNUM == config.constant.STRING.NOCLASSNUM){row.CLNUM = '無班次'};
							console.log(row.CYEAR, row.CNAME, row.CLNUM, row.CPRO, row.CREDIT, row.CTYPE,row.AVGGPA);
							let reply = template.course.telegram(row,context.platform);
							context.sendMessage( reply, {parse_mode:'Markdown'});
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

		console.log(action);
		await context.sendText(text);
	}
	if(reachLimitFlag){
		await context.sendText(`🐳 搜尋結果數達到上限，或許可以將搜尋範圍縮小 🐳`);
	}
	
};

module.exports = handler;