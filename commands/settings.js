const setSettings = require('../functions/brain.js').setSettings

module.exports.run = async (message, args) => {	setSettings(message.user.ircUsername, args, function (msg) { message.user.sendMessage(msg) }) }

module.exports.help = { name: "s", alias: 'settings' }