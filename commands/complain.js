// Importing Modules
const log = require('../utils').log

module.exports.help = { name: 'complain', alias: 'c' }
module.exports.run = async (instance, args, callback) => {
    log(`${instance.user.ircUsername} complained : ${args.join(' ')}`, 3)
	callback(`Your message is now displayed for the owner to see.`)
}