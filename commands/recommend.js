const getRandomMap = require('../functions/brain.js').getRandomMap

module.exports.run = async (message, args) => { getRandomMap(args, function (msg) { message.user.sendMessage(msg) }) }

module.exports.help = { name: "r", alias: 'recommend' }