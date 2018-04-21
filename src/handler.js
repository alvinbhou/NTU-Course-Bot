const config = require('./config');
const parser = require('./parser');
const sqlite3 = require('sqlite3').verbose();
const command = require('./command');
const template = require('./template');
const emoji = require('./emoji');
const db = new sqlite3.Database('data/ntucourse.db');
const sqlCPrefix = (str) => {
	return ('%' + str + '%')
}


const dbCourseQueryReply = function (sql, query_arr, context, action) {
	let reachLimitFlag = false;
	db.all(sql, query_arr, (err, rows) => {
		if (err) {
			throw err;
		}
		console.log('courses length:', rows.length);
		/* no result */
		if (rows.length == 0) {
			context.sendText(`${emoji.blowfish} 找不到結果 ${emoji.blowfish}`)
			return;
		}

		/* substitution */
		for (let i = 0; i < rows.length; ++i) {
			let row = rows[i];
			if (row.CLNUM == config.constant.STRING.NOCLASSNUM) {
				row.CLNUM = '無班次'
			};
			if(row.CTIME == -1){
				row.CTIME = '無';
			}
			if(row.CPRO == -1){
				row.CPRO = '?';
			}
			if(row.CDEPNAME ==  config.constant.STRING.NOCDEPNAME){
				row.CDEPNAME = row.CDEP;
			}
			console.log(row.CYEAR, row.CNAME, row.CLNUM, row.CPRO, row.CDEPNAME, row.CTYPE, row.AVGGPA);
		}

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
		} else if (rows.length <= 10 && rows.length >= 2) {
			switch (context.platform) {
				case config.constant.PLATFORM.MESSG:
					let elements = template.course.messenger.list(rows);
					context.sendGenericTemplate(elements, [], {
							// top_element_style: 'compact'
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

					/* prevent awaiting too long */
					if (i > config.settings.cawaitnumlimit && action.sort) {
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
					break;
					return;
				}
			}
		};
		iterateCourse()
			.then(() => {
				console.log('reach limit', reachLimitFlag);
				if (reachLimitFlag) {
					context.sendText(`${emoji.whale} 達到上限，或許可以將搜尋範圍縮小 ${emoji.whale}`);
				}
			})
	});

};
const courseQuery = function (context, action) {

	let query_target = action.course_type ? 'CNAME' : 'CUID';
	let sql = `SELECT * FROM course
					WHERE ${query_target} LIKE ? AND
					CYEAR = ? AND
					AVGGPA >= ?
					ORDER BY AVGGPA DESC`;
	let query_array = [sqlCPrefix(action.argv[0]), action.course_year, action.course_gpa];
	dbCourseQueryReply(sql, query_array, context, action);

};

const deptQuery = function (context, action) {
	let sql = `SELECT * FROM course \n`;
	sql += `WHERE CYEAR = ? AND \n `;
	sql += `CDEP = ? AND \n `;
	sql += `CNAME NOT LIKE '%${config.constant.STRING.SPECIAL_STUDY}%' AND \n`

	/* gpa */
	if (action.gpa_above) {
		sql += `AVGGPA >= ? `;
	} else {
		sql += `AVGGPA <= ? AND\n AVGGPA >= 0 `;
	}
	/* 選/必修 */
	if (action.course_sub_type == 1) {
		sql += ` AND \n CTYPE = "必修" \n `;
	} else if (action.course_sub_type == 2) {
		sql += ` AND \n CTYPE = "選修" \n `;
	} else if (action.course_sub_type == 3) {
		sql += ` AND \n CTYPE = "必帶" \n `;
	}
	if (action.gpa_above) {
		sql += `ORDER BY AVGGPA DESC`;
	} else {
		sql += `ORDER BY AVGGPA`;
	}

	/* 使用中文系所名稱 */
	if (action.dept_type) {
		if (action.dept_name.length >= 15) {
			context.sendText("系所名稱過長！");
			return;
		}
		let dsql = `SELECT * FROM department \nWHERE `;
		/* dept name */
		dsql += `DNAME LIKE ? `;
		db.all(dsql, sqlCPrefix(action.dept_name), (err, rows) => {
			console.log(rows);
			(async function () {
				if (rows.length == 0) {
					context.sendText(`${emoji.blowfish} 找不到結果，或許可以打全名或是系所代號 ${emoji.blowfish}`)
				} else if (rows.length >= 2) {
					let reply = "請問是指下列哪個科系？\n\n";
					rows.forEach((row) => {
						reply += `[${row.DUID}] ${row.DNAME}\n`;
					});
					reply += `	\n或許可以使用[系所代號]更好搜尋！`
					await context.sendText(reply);
				}
				/* query course! */
				else if (rows.length == 1) {
					let query_array = [action.course_year, rows[0].DUID, action.course_gpa];
					dbCourseQueryReply(sql, query_array, context, action);
				}
			})()
		});
	}
	/* 使用系所代號 */
	else{
		let query_array = [action.course_year, action.dept_name.toUpperCase(), action.course_gpa];
		dbCourseQueryReply(sql, query_array, context, action);
	}
}

const tchrQuery = function(context, action){
	let sql = `SELECT * FROM course \n`;
	sql += `WHERE CYEAR = ? AND \n `;
	sql += `CPRO LIKE ? AND \n `;
	sql += `AVGGPA >= ? `;
	sql += `ORDER BY AVGGPA DESC`;
	if(action.tchr_name.length == 0){
		context.sendText(`${emoji.blowfish} 找不到教師 ${emoji.blowfish}`);
		return;
	}
	else{
		let query_array = [action.course_year,sqlCPrefix(action.tchr_name), action.course_gpa];
		dbCourseQueryReply(sql, query_array, context, action);
	}
}

const commandInfoReply = async function (code, context) {
	if (code == command.commands_code.COURSE) {
		if (context.platform == config.constant.PLATFORM.TG) {
			let reply = template.command_info.course.telegram;
			await context.sendMessage(reply.message, {
				parse_mode: 'Markdown'
			}).catch(console.error);;
		} else if (context.platform == config.constant.PLATFORM.MESSG) {
			let reply = template.command_info.course.messenger;
			await context.sendText(reply.message);
			await context.sendText(reply.quickreplyHeader, reply.quickreply).catch(console.error);
		}
	} else if (code == command.commands_code.DEPT) {
		if (context.platform == config.constant.PLATFORM.TG) {
			let reply = template.command_info.dept.telegram;
			await context.sendMessage(reply.message, {
				parse_mode: 'Markdown'
			}).catch(console.error);;
		} else if (context.platform == config.constant.PLATFORM.MESSG) {
			let reply = template.command_info.dept.messenger;
			await context.sendText(reply.message);
		}
	}
	else if (code == command.commands_code.TEACHER) {
		if (context.platform == config.constant.PLATFORM.TG) {
			let reply = template.command_info.teacher.telegram;
			await context.sendMessage(reply.message, {
				parse_mode: 'Markdown'
			}).catch(console.error);;
		} else if (context.platform == config.constant.PLATFORM.MESSG) {
			let reply = template.command_info.teacher.messenger;
			await context.sendText(reply.message);
		}
	}
}

const handler = async context => {
	/* postback event: messenger */
	if (context.event.isPostback) {
		console.log(context.event.payload);
		let payload = context.event.payload;
		if (context.event.payload == config.payload.GET_STARTED) {
			await context.sendText(template.start);
			let reply = template.help.messenger;
			await context.sendText(reply.message);
			await context.sendText(reply.quickreplyHeader, reply.quickreply).catch(console.error);
		}
		else if (payload == config.payload.QUERY_COURSE) {
			let callback_data = config.constant.STRING[payload];
			await context.sendText(callback_data);
			commandInfoReply(command.commands_code.COURSE, context);
		} else if (payload == config.payload.QUERY_DEPT) {
			let callback_data = config.constant.STRING[payload];
			await context.sendText(callback_data);
			commandInfoReply(command.commands_code.DEPT, context);

		}else if (payload == config.payload.QUERY_TCHR) {
			let callback_data = config.constant.STRING[payload];
			await context.sendText(callback_data);
			commandInfoReply(command.commands_code.TEACHER, context);
		} 
		return;
	}

	/* postback query event: telegram*/
	if (context.event.isCallbackQuery) {
		if (context.platform == config.constant.PLATFORM.TG) {
			let payload = context.event.callbackQuery.data;
			if (payload == config.payload.QUERY_COURSE) {
				commandInfoReply(command.commands_code.COURSE, context);
			} else if (payload == config.payload.QUERY_DEPT) {
				commandInfoReply(command.commands_code.DEPT, context);
			}else if (payload == config.payload.QUERY_TCHR) {
				commandInfoReply(command.commands_code.TEACHER, context);
			}else if (payload == config.payload.GITHUB_PAYLOAD) {
				await context.sendText(config.github.url);
			}
		}
		return;

	}
	/* quick reply event: messenger */
	if (context.event.isQuickReply) {
		let payload = context.event.quickReply.payload;
		console.log(payload);

		if (payload == config.payload.QUERY_COURSE) {
			let callback_data = config.constant.STRING[payload];
			await context.sendText(callback_data);
			commandInfoReply(command.commands_code.COURSE, context);
		} else if (payload == config.payload.QUERY_DEPT) {
			let callback_data = config.constant.STRING[payload];
			await context.sendText(callback_data);
			commandInfoReply(command.commands_code.DEPT, context);

		}else if (payload == config.payload.QUERY_TCHR) {
			let callback_data = config.constant.STRING[payload];
			await context.sendText(callback_data);
			commandInfoReply(command.commands_code.TEACHER, context);
		} 
		else if (payload in config.constant.EXAMPLES.COURSE) {
			let callback_data = config.constant.EXAMPLES.COURSE[payload];
			await context.sendText(callback_data);
			let action = parser.getAction(callback_data);
			courseQuery(context, action);
		}
		else if(payload == config.payload.GITHUB_PAYLOAD){
			let elements = template.more_info.messenger;
			context.sendGenericTemplate(elements, [], {})
				.catch((error) => {
					console.log(error);
				});
		}
		return;
	}

	/* text event */
	if (context.event.isText) {
		const text = context.event.text;
		if (config.whitelist.indexOf(text) > 0) {
			return;
		}
		let action = parser.getAction(text);
		await context.typing(200);
		console.log(action);
		/* get started */
		if (action.cmd == command.commands_code.START) {
			let reply = {};
			switch(context.platform){
				case config.constant.PLATFORM.TG:
					await context.sendText(template.start);
					reply = template.help.telegram;
					await context.sendMessage(reply.message, {
						parse_mode: 'Markdown'
					});
					await context.sendMessage(reply.inlineHeader, reply.inline).catch(console.error);
					break;
				case config.constant.PLATFORM.MESSG:
					await context.sendText(template.start);
					reply = template.help.messenger;
					await context.sendText(reply.message);
					await context.sendText(reply.quickreplyHeader, reply.quickreply).catch(console.error);
					break;
			}
			
		}
		/* course command */
		else if (action.cmd == command.commands_code.COURSE) {
			if (!action.argv.length) {
				commandInfoReply(action.cmd, context);
			} else if (action.argv[0].length == 0) {
				commandInfoReply(action.cmd, context);
			} else {
				courseQuery(context, action);

			}
		}
		/* department command */
		else if (action.cmd == command.commands_code.DEPT) {
			if (!action.dept_name.length) {
				commandInfoReply(action.cmd, context);
			} else {
				deptQuery(context, action);
			}
		}
		else if(action.cmd == command.commands_code.TEACHER){
			if (!action.tchr_name.length) {
				commandInfoReply(action.cmd, context);
			} else {
				tchrQuery(context, action);
			}
		}
		/* help command*/
		else if (action.cmd == command.commands_code.HELP) {
			let reply = {};
			switch (context.platform) {
				case config.constant.PLATFORM.TG:
					reply = template.help.telegram;
					await context.sendMessage(reply.message, {
						parse_mode: 'Markdown'
					});
					await context.sendMessage(reply.inlineHeader, reply.inline).catch(console.error);
					break;
				case config.constant.PLATFORM.MESSG:
					reply = template.help.messenger;
					await context.sendText(reply.message);
					await context.sendText(reply.quickreplyHeader, reply.quickreply).catch(console.error);
					break;

			}

		} else if (action.cmd == command.commands_code.UNDEFINED) {
			await context.sendText(template.undefined_reply);
		}
	}


};

module.exports = handler;