// Importing Modules

const log = require('./utils.js').log

// Read Commands
exports.consoleCommand = async (input, client) => {
    let instance = {}
    instance.user = []
    instance.user.ircUsername = process.env.IRC_USERNAME
    instance.message = input
    let args = input.split(' ')
    let command = args[0].toLowerCase()
    args.shift()
    if (client.commands.get(command)) return client.commands.get(command).run(instance, args, (function (msg) { log(msg, 1) }))
    return laboratory(input, client, command, instance, args)
}

// Laboratory Modules


async function laboratory (input, client, command, instance, args) {
    log('Initialization', 4)

    // Testing Laboratory
    log(`Result : ${69+420}`, 4)
}