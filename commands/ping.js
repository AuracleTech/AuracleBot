module.exports.help = { name: 'ping', alias: 'p' }
module.exports.run = async (message, args, callback) => { callback('Pong!') }