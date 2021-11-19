// Importing Modules
const scoresManager = require('./scoresManager')
const log = require('./utils').log

// Variables
let cooldownUsers = new Set()
let cooldownTime = 3
let prefix = '!'

// Read Commands
module.exports = async (instance, client) => {
    if (instance.self) return
    
    if (!await scoresManager.isOnCooldown(instance.user.ircUsername)) scoresManager.getTopScores(instance.user.ircUsername)

    if(!instance.getAction() && instance.message[0] != prefix) return

    if (cooldownUsers.has(instance.user.ircUsername)) return instance.user.sendMessage(`Wait at least ${cooldownTime} seconds between each commands`)
    setTimeout(() => { cooldownUsers.delete(instance.user.ircUsername) }, 1e3 * cooldownTime)
    cooldownUsers.add(instance.user.ircUsername)

    log(`${instance.user.ircUsername} ${instance.getAction() ? 'action' : 'command'} : ${instance.message}`)

    if (instance.getAction()) return doAction(client, instance)
    if (instance.message[0] == prefix) return doCommand(instance, client)
    return log(`${this.filename}.constructor ${instance.message}`, 3)
}

doAction = (client, instance) => {
    client.commands.get('np').run(instance, instance.getAction().split(' '), message => { reply(instance, message) })
}

reply = (instance, message) => {
    log(`${process.env.IRC_USERNAME} : ${message}`)
    instance.user.sendMessage(message)
}

doCommand = (instance, client) => {
    let args = instance.message.slice(prefix.length).split(' ')
    let command = args[0].toLowerCase()
    args.shift()
    if (client.commands.get(command)) return client.commands.get(command).run(instance, args, message => { reply(instance, message) })
    else return instance.user.sendMessage(`Command ${command} is nonexistent`)
}