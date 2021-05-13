const addMap = require('../functions/get.js').addMap

module.exports.run = async (message, args) => {
	addMap(args, function (msg) { message.user.sendMessage(msg) })
}

module.exports.help = {
    name: "a",
    alias: 'add'
}