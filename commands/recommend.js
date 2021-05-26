const getRandomMaps = require('../functions/brain.js').getRandomMaps

module.exports.run = async (message, args) => { getRandomMaps(args, function (msg) { message.user.sendMessage(msg) }, 1) }

module.exports.help = { name: "r", alias: 'recommend' }