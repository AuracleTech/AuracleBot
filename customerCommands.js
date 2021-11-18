// Importing Modules
const getTopScores = require('./scoresManager.js').getTopScores
const log = require('./utils.js').log

// Variables
var cooldown = new Set()
var cooldownDelay = 3
var commandHistory = {}
var prefix = '!'

// Read Commands
exports.customerCommand = (instance, client) => {
    if (instance.self) return

    getTopScores(instance.user.ircUsername)

    if(!instance.getAction() && instance.message[0] != prefix) return

    if (cooldown.has(instance.user.ircUsername)) return instance.user.sendMessage(`Wait at least ${cooldownDelay} seconds between each commands`)
    setTimeout(() => { cooldown.delete(instance.user.ircUsername) }, 1e3 * cooldownDelay)
    cooldown.add(instance.user.ircUsername)

    log(`${instance.user.ircUsername} used ${instance.getAction() ? 'ACTION' : 'CMD'} : ${instance.message}`)

    if (instance.getAction()) return doAction(client, instance)
    if (instance.message[0] == prefix) return doCommand(instance, client)
    return log(`eventsManager.customerCommand() ${instance.message}`, 2)
}

doAction = (client, instance) => {
    client.commands.get('np').run(instance, instance.getAction().split(' '), message => { reply(instance, message) })
}

reply = (instance, message) => {
    log(`${process.env.IRC_USERNAME} replied : ${message}`)
    instance.user.sendMessage(message)
}

doCommand = (instance, client) => {
    let args = instance.message.slice(prefix.length).split(' ')
    let command = args[0].toLowerCase()
    args.shift()
    if (client.commands.get(command)) return client.commands.get(command).run(instance, args, message => { reply(instance, message) })
    else return instance.user.sendMessage(`Command ${command} is nonexistent`)
}