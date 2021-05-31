const log = require('../functions/brain.js').log

module.exports.run = async (message, args, callback) => {
	// TODO : TO TEST : Register the last command and result for each player then display it on complain
	log(`Complain from ${message.user.ircUsername} : ${args.join(' ')}`, 2)
	callback(`Thank you ${message.user.ircUsername}`)
}

module.exports.help = { name: "c", alias: 'complain' }