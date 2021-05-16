const addMap = require('../functions/brain.js').addMap

module.exports.run = async (message, args) => {	addMap(args, function (msg) { message.user.sendMessage(msg) }) }

module.exports.help = { name: "a", alias: 'add' }