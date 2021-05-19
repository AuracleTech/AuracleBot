const Banchojs = require("bancho.js");
const fs = require('fs')
const { USERNAME, PASSWORD, prefix } = require('./config.json')

const client = new Banchojs.BanchoClient({ username: USERNAME, password: PASSWORD });
client.commands = new Map()

let cooldowng = new Set()
let cooldown = new Set()
let cdseconds = 10

fs.readdir("./commands/", (err, files) => {
    if (err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        console.log("No commands find")
        return
    }
    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`)
        console.log(`Loaded ${f}`)
        client.commands.set(props.help.name, props)
        client.commands.set(props.help.alias, props)
    })
})

/*client.connect().then(() => {
    console.log("Logged in");
    client.on("PM", (message) => {
    	var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0')
        var yyyy = today.getFullYear()
        var hours = today.getHours()
        var mins = today.getMinutes().toString().padStart(2, '0')

        var todays = mm + '/' + dd + '/' + yyyy + ' ' + hours + ":" + mins;
        console.log(`${todays} | ${message.user.ircUsername}: ${message.message}`)
        if (message.self) return
        if (message.message[0] != prefix) return


        if (cooldowng.has(message.user.ircUsername)) return
        if (cooldown.has(message.user.ircUsername)) {
            cooldowng.add(message.user.ircUsername)
            message.user.sendMessage(`Please wait ${cdseconds} seconds before sending another command.`)
            return
        }

        let args = message.message.slice(prefix.length).split(/ +/);
        args.shift()
        let command = message.message.split(" ")
        let cmd = command[0].toLowerCase()
        let commandfile = client.commands.get(cmd.slice(prefix.length))
        if (commandfile) {
            cooldown.add(message.user.ircUsername)
            commandfile.run(message, args)
        }
        setTimeout(() => {
            cooldown.delete(message.user.ircUsername)
            cooldowng.delete(message.user.ircUsername)
        }, cdseconds * 1000)
    })
}).catch(console.error);*/







/* ALL TEMPORARY DEBUG STUFF */
var PouchDB = require('pouchdb-node')
const addMap = require('./functions/brain.js').addMap

const mapRating = require('./functions/brain.js').mapRating
const mapLength = require('./functions/brain.js').mapLength
const getRandomMap = require('./functions/brain.js').getRandomMap
const arrayInArray = require('./functions/brain.js').arrayInArray

const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });

var db_maps = new PouchDB('DB_Maps')

const labels = require("./labels.json")

readline.on('line', async (input) => {

	var args = ["tech", "osu", "cake", "maniaque"]
	var argsAddMap = ["osu", "tech", 115193]

	//getRandomMap(args, function (msg) { console.log("getRandomMap", msg) })

	addMap(argsAddMap, function (msg) { console.log("addMap", msg) })

	//Amount of maps in the DB_Maps
	//var meme; db_maps.info().then(async function (info) { meme = info.doc_count;console.log(meme) })
});

process.on('uncaughtException', function(err) { console.log('Caught exception: ' + err) });
