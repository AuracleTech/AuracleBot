const setSettings = require('../functions/brain.js').setSettings

module.exports.run = async (message, args, callback) => {	setSettings(message.user.ircUsername, args, function (msg) { callback(msg) }) }

module.exports.help = { name: "s", alias: 'settings' }