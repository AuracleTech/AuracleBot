module.exports.help = { name: 'ping', alias: 'p' }
module.exports.run = async (instance, args, callback) => { callback('Pong!') }