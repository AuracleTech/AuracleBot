const Banchojs = require("bancho.js");
const fs = require('fs')
const { USERNAME, PASSWORD, prefix } = require('./config.json')
const log = require('./functions/brain.js').log

const client = new Banchojs.BanchoClient({ username: USERNAME, password: PASSWORD });
client.commands = new Map()

let cooldowng = new Set()
let cooldown = new Set()
let cdseconds = 5

var files = fs.readdirSync('pollution')
for (let file of files) if(file != '.keep') fs.unlinkSync('pollution/' + file)

fs.readdir("./commands/", (err, files) => {
    if (err) log(err)
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) return log('No commands found')
    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`)
        log(`Loaded ${f}`)
        client.commands.set(props.help.name, props)
        client.commands.set(props.help.alias, props)
    })
})

client.connect().then(() => {
    log("Logged in");
    client.on("PM", (message) => {
        setTimeout(() => {
            cooldown.delete(message.user.ircUsername)
            cooldowng.delete(message.user.ircUsername)
        }, cdseconds * 1000)
    	var today = new Date()
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0')
        var yyyy = today.getFullYear()
        var hours = today.getHours()
        var mins = today.getMinutes().toString().padStart(2, '0')
        var todays = mm + '/' + dd + '/' + yyyy + ' ' + hours + ":" + mins
        log(`${todays} | ${message.user.ircUsername}: ${message.message}`, message.user.ircUsername == "AuracleTech" ? 1 : 0)
        if (message.self) return

        if (message.message[0] != prefix) return logCommand(null, message)

        if (cooldowng.has(message.user.ircUsername)) return
        if (cooldown.has(message.user.ircUsername)) {
            cooldowng.add(message.user.ircUsername)
            return message.user.sendMessage(`Please wait ${cdseconds} seconds before sending another command.`)
        }

        let args = message.message.toLowerCase().slice(prefix.length).split(/ +/);
        args.shift()
        let command = message.message.split(" ")
        let cmd = command[0].toLowerCase()
        if((cmd == "!complain" || cmd == "!c") && commandHistory[message.user.ircUsername]) console.log(`Command History for ${message.user.ircUsername}`, commandHistory[message.user.ircUsername])
        let commandfile = client.commands.get(cmd.slice(prefix.length))
        if(commandfile) return logCommand(commandfile, message, args)
    })
})

var commandHistory = {}

function logCommand(commandfile = null, message, args = null){
    cooldown.add(message.user.ircUsername)
    if (commandfile) return commandfile.run(message, args, function (msg) { message.user.sendMessage(msg); return commandHistory[message.user.ircUsername] = [message.message, msg] })
    else return calcPerf(message.message, function (msg) { message.user.sendMessage(msg); return commandHistory[message.user.ircUsername] = [message.message, msg] })
}

// Console Commands

var PouchDB = require('pouchdb-node')
var db_maps = new PouchDB('DB_Maps')
var db_settings = new PouchDB('DB_Settings')
const addMap = require('./functions/brain.js').addMap
const getRandomMaps = require('./functions/brain.js').getRandomMaps
const setSettings = require('./functions/brain.js').setSettings
const calcPerf = require('./functions/brain.js').calcPerf
const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });

readline.on('line', async (input) => {
	let args = input.toLowerCase().slice(prefix.length).split(/ +/);
    args.shift()
    let command = input.split(" ")[0].toLowerCase()
    switch(command) {
        case "np":
            calcPerf(args.join(" "), function (msg) { log(msg, 1) })
            break
        case "r":
            getRandomMaps(args, function (msg) { log(msg) }, 1)
            break
        case "a":
            addMap(args, function (msg) { log(msg) })
            break
        case "s":
            setSettings("AuracleTech", args, function (msg) { log(msg) })
            break
        case "infos":
            db_maps.info().then(async function (info) { log(`${info.doc_count} maps in maps database`) })
            db_settings.info().then(async function (info) { log(`${info.doc_count} options in the settings`) })
            break
    }
});

process.on('uncaughtException', function(err) { log('Caught exception: ' + err.stack, 3) });