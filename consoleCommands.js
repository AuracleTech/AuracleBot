// Importing Modules

const log = require('./utils.js').log

// Read Commands
async function consoleCommand(input, client, debugMode) {
    let message = {}
    message.user = []
    message.user.ircUsername = 'Auracle'
    message.message = input
    let args = input.split(' ')
    let command = args[0].toLowerCase()
    args.shift()
    if (debugMode) return log('Results : ' + await laboratory(input, client, command, message, args), 4)
    if (client.commands.get(command)) return client.commands.get(command).run(message, args, (function (msg) { log(msg, 1) }))
    return log('Command unavailable.', 1)
}

// Importing Laboratory Modules

// Testting Laboratory
async function laboratory (input, client, command, message, args) {
    log('Initialization', 4)
    return new Promise((resolve, reject) => {
        if (client.commands.get(command)) client.commands.get(command).run(message, args, (function (msg) { resolve(msg) }))
        else log('Command unavailable.', 4)
    })
}

exports.consoleCommand = consoleCommand