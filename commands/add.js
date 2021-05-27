const addMap = require('../functions/brain.js').addMap

module.exports.run = async (message, args, callback) => {	addMap(args, function (msg) { callback(msg) }) }

module.exports.help = { name: "a", alias: 'add' }