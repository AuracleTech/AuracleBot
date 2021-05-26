module.exports.run = async (message, args) => {	message.user.sendMessage("Pong!") }

module.exports.help = { name: "p", alias: 'ping' }