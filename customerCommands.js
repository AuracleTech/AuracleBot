// Importing Modules
const getTopScores = require('./scoresManager.js').getTopScores
const log = require('./utils.js').log

// Variables
var cooldown = new Set()
var cooldownDelay = 3
var commandHistory = {}
var prefix = '!'

// Read Commands
function customerCommand (message, client) {

    if (message.self) return

    getTopScores(message.user.ircUsername)

    if(!message.getAction() && message.message[0] != prefix) return

    if (cooldown.has(message.user.ircUsername)) return message.user.sendMessage(`Wait at least ${cooldownDelay} seconds between each commands`)
    setTimeout(() => { cooldown.delete(message.user.ircUsername) }, 1e3 * cooldownDelay)
    cooldown.add(message.user.ircUsername)

    log(`${message.user.ircUsername} used ${message.getAction() ? 'ACTION' : 'CMD'} : ${message.message}`)

    if (message.getAction()) return doAction(message)
    if (message.message[0] == prefix) return doCommand(message, client)
    return log(`eventsManager.customerCommand() ${message}`, 2)
}

function doAction () {
    client.commands.get('np').run(message, message.getAction().split(' '), (function (msg) { message.user.sendMessage(msg) })) // TOFIX : Better way of splitting
}

function doCommand (message, client) {
    let args = message.message.slice(prefix.length).split(' ')
    let command = args[0].toLowerCase()
    args.shift()
    if (client.commands.get(command)) return client.commands.get(command).run(message, args, (function (msg) { message.user.sendMessage(msg) }))
    else return message.user.sendMessage(`Command ${command} is nonexistent`)
}

exports.customerCommand = customerCommand