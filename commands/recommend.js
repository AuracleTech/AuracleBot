const getRandomMaps = require('../functions/brain.js').getRandomMaps

module.exports.run = async (message, args, callback) => { getRandomMaps(args, function (msg) { callback(msg) }, 1) }

module.exports.help = { name: "r", alias: 'recommend' }