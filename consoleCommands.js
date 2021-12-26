// Importing Modules
const log = require('./utils').log

// Read Commands
module.exports = async (input, client) => {
    let instance = {}
    instance.user = []
    instance.user.ircUsername = process.env.IRC_USERNAME
    instance.user.id = process.env.OSU_USER_ID
    instance.message = input
    let args = input.split(' ')
    let command = args[0].toLowerCase()
    args.shift()
    log(input, 5)
    if (client.commands.get(command)) return client.commands.get(command).run(instance, args, msg => { log(msg, 1) })
    return laboratory(input, client, command, instance, args, 'No Result Defined')
}

// Temporary Modules

laboratory = async (input, client, command, instance, args, result) => {
    log('Initialization', 4)
    log(`Result : ${result}`, 4)
}