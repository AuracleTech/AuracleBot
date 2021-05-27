const getRandomMaps = require('../functions/brain.js').getRandomMaps

// TODO : Add argument selector to check the amount of request bombed maps
module.exports.run = async (message, args, callback) => { getRandomMaps(args, function (msg) { callback(msg) }, 5) }

module.exports.help = { name: "b", alias: 'bomb' }