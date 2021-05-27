const Banchojs = require("bancho.js");
const fs = require('fs')
const { USERNAME, PASSWORD, prefix } = require('./config.json')
const log = require('./functions/brain.js').log

const client = new Banchojs.BanchoClient({ username: USERNAME, password: PASSWORD });
client.commands = new Map()

let cooldowng = new Set()
let cooldown = new Set()
let cdseconds = 10

var lastCommandHistory = {} // TODO : NOW

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

        if (message.message[0] != prefix) {
            cooldowng.add(message.user.ircUsername)
        	return calcPerf(message.message, function (msg) { message.user.sendMessage(msg) })
        }

        if (cooldowng.has(message.user.ircUsername)) return
        if (cooldown.has(message.user.ircUsername)) {
            cooldowng.add(message.user.ircUsername)
            return message.user.sendMessage(`Please wait ${cdseconds} seconds before sending another command.`)
        }

        let args = message.message.toLowerCase().slice(prefix.length).split(/ +/);
        args.shift()
        let command = message.message.split(" ")
        let cmd = command[0].toLowerCase()
        let commandfile = client.commands.get(cmd.slice(prefix.length))
        if(commandfile) {
            cooldown.add(message.user.ircUsername)
            return commandfile.run(message, args)
        }
    })
})

process.on('uncaughtException', function(err) { log('Caught exception: ' + err.stack, 3) });

// AURACLE'S DEBUG MESS

var PouchDB = require('pouchdb-node')
const addMap = require('./functions/brain.js').addMap
const mapRating = require('./functions/brain.js').mapRating
const mapLength = require('./functions/brain.js').mapLength
const getRandomMaps = require('./functions/brain.js').getRandomMaps
const arrayInArray = require('./functions/brain.js').arrayInArray
const setSettings = require('./functions/brain.js').setSettings
const complain = require('./functions/brain.js').complain
const calcPerf = require('./functions/brain.js').calcPerf
const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });
var db_maps = new PouchDB('DB_Maps')
var db_settings = new PouchDB('DB_Settings')

readline.on('line', async (input) => {
	var args = ["osu", "cake", "2*"]
	var argsAddMap = ["osu", "tech", 1080535] 
	var argsSetSettings = ["gamemode", "osu"]
	var argsComplain = ["eat", "my", "shit", "fucking", "cunt", "you", "garbage", "of", "a", "human"]
	var messageLink = "is listening to [osu.ppy.sh/beatmapsets/1002271#/2097898 Bliitzit - Team Magma & Aqua Leader Battle Theme (Unofficial)]"
	var messageLink2 = "is editting [osu.ppy.sh/b/738063 Reol - No title [Lust's Insane]]"
	var taikoMap = "is eating [osu.ppy.sh/beatmapsets/1311915#mania/2719063 sum weird] +MEME <Taiko>"
    var hardRockMap = "is playing [osu.ppy.sh/beatmapsets/261959#/606169 Haruna Luna - Kimiiro Signal-TV size ver.- [Xinely's Hard]] +HardRock"

	calcPerf(hardRockMap, function (msg) { log(msg, 1) })
	//complain("AuracleTech", argsComplain, function (msg) { log(msg) })
	//log("suck my tiny little squirrel")
	//getRandomMaps(args, function (msg) { log(msg) }, 5)
	//addMap(argsAddMap, function (msg) { log(msg) })
	//setSettings("AuracleTech", argsSetSettings, function (msg) { log("setSettings", msg) })

	//db_maps.info().then(async function (info) { log(info.doc_count) }) //Amount of maps in db_maps
	//db_settings.info().then(async function (info) { log(info.doc_count) }) //Amount of user settings in db_settings
});