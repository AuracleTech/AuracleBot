const getDefaultMode = require('../functions/get.js').defaultMode
var PouchDB = require('pouchdb-node')
var db_modes = new PouchDB('DB_Modes')

module.exports.run = async (message, args) => {
	if (args[0] == "osu" || args[0] == "mania") {
		db_modes.allDocs({username : message.user.ircUsername}, function (err, res) {
		//(`SELECT * FROM modes WHERE username = "${message.user.ircUsername}"`, function (err, res, fields) {
			if (res.length == 0) {
				db_modes.put({username: message.user.ircUsername, mode: args[0]}).then((res) => {
					//connection.query(`INSERT INTO modes (username, mode) VALUES ("${message.user.ircUsername}", "${args[0]}")`, function (err, res, fields) {
					message.user.sendMessage('Your default game mode is now set to: ' + args[0])
				})
			} else {
				db_modes.get({username: message.user.ircUsername}).then((doc) => {
					//connection.query(`UPDATE modes SET mode = "${args[0]}" WHERE username = "${message.user.ircUsername}"`, function (err, res, fields) {
					doc.mode = args[0]
					message.user.sendMessage('Your default game mode is now set to: ' + args[0])
					return db.put(doc)
				})


			}
		})
	} else {
		message.user.sendMessage('Please specify a correct mode. (osu, mania)')
	}
}
module.exports.help = {
	name: "mode"
}