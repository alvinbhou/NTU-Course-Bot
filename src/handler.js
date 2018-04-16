const config = require('./config');
const parser = require('./parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data/ntucourse.db');
const command = require('./command');
const template = require('./template');
const emoji = require('./emoji');
const messgapi = require('./messenger_api');
const sqlCPrefix = (str) => {
	return ('%' + str + '%')
}

messgapi.init();
const handler = async context => {
	/* postback event */
	if (context.event.isPostback) {
		if (context.event.payload == config.payload.GET_STARTED) {
			context.sendText("您好，歡迎使用NTU Course Bot\n可以使用 /h 或 /help 查看相關指令");
		}
	}

	/* text event */
	let reachLimitFlag = false;
	if (context.event.isText) {
		const text = context.event.text;
		let action = parser.getAction(text);
		context.typing(1000);
		console.log(action);

		if (action.cmd == command.commands_code.COURSE) {
			let query_target = action.course_type ? 'CNAME' : 'CUID';
			let sql = `SELECT * FROM course
							WHERE ${query_target} LIKE ? AND
							CYEAR = ? AND
							AVGGPA >= ?
							ORDER BY AVGGPA DESC`;

			db.all(sql, [sqlCPrefix(action.argv[0]), action.course_year, action.course_gpa], (err, rows) => {
				if (err) {
					throw err;
				}
				console.log('courses length:', rows.length);
				/* template for small number of query result */
				if (rows.length == 1) {
					switch (context.platform) {
						case config.constant.PLATFORM.MESSG:
							let elements = template.course.messenger.single(rows);
							context.sendGenericTemplate(elements, [], {
									top_element_style: 'compact'
								})
								.catch((error) => {
									console.log(error);
								});
							return;
							break;
					}
				} else if (rows.length <= 4 && rows.length >= 2) {
					switch (context.platform) {
						case config.constant.PLATFORM.MESSG:
							let elements = template.course.messenger.list(rows);
							context.sendListTemplate(elements, [], {
									top_element_style: 'compact'
								})
								.catch((error) => {
									console.log(error);
								});
							return;
							break;
					}
				}

				async function iterateCourse() {
					for (let i = 0; i < rows.length; ++i) {
						let row = rows[i];
						if (row.CLNUM == config.constant.STRING.NOCLASSNUM) {
							row.CLNUM = '無班次'
						};
						console.log(row.CYEAR, row.CNAME, row.CLNUM, row.CPRO, row.CREDIT, row.CTYPE, row.AVGGPA);
						/* sort as descending order or not */
						let reply = "";
						if (action.sort || i == Math.min(rows.length, config.settings.cnumlimit)) {
							switch (context.platform) {
								case config.constant.PLATFORM.TG:
									reply = template.course.telegram(row);
									await context.sendMessage(reply, {
										parse_mode: 'Markdown'
									});
									break;
								case config.constant.PLATFORM.LINE:
									reply = template.course.line(row);
									await context.sendText(reply);
									break;
								case config.constant.PLATFORM.MESSG:
									reply = template.course.messenger.multi(row);
									await context.sendText(reply);
									break;

							}

							/* to prevent await too long */
							if (i > config.settings.cawaitnumlimit) {
								reachLimitFlag = true;
								break;
							}
						} else {
							switch (context.platform) {
								case config.constant.PLATFORM.TG:
									reply = template.course.telegram(row);
									context.sendMessage(reply, {
										parse_mode: 'Markdown'
									});
									break;
								case config.constant.PLATFORM.LINE:
									reply = template.course.line(row);
									context.sendText(reply);
									break;
								case config.constant.PLATFORM.MESSG:
									reply = template.course.messenger.multi(row);
									context.sendText(reply);
									break;
							}
						}
						if (i > config.settings.cnumlimit) {
							reachLimitFlag = true;
							console.log('reach limit');
							break;
							return;
						}
					}
				};
				iterateCourse()
					.then(() => {
						console.log(reachLimitFlag);
						if (reachLimitFlag) {
							context.sendText(`${emoji.whale} 達到上限，或許可以將搜尋範圍縮小 ${emoji.whale}`);
						}
					})
			});
		}
		/* end of course */

	}


};

module.exports = handler;