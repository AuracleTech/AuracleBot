const Banchojs = require("bancho.js");
const fs = require('fs')
const { USERNAME, PASSWORD, prefix } = require('./config.json')
const getDefaultMode = require('./functions/brain.js').defaultMode

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

client.connect().then(() => {
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
}).catch(console.error);







/* ALL TEMPORARY DEBUG STUFF */
var PouchDB = require('pouchdb-node')
const addMap = require('./functions/brain.js').addMap

const mapRating = require('./functions/details.js').mapRating
const mapLength = require('./functions/details.js').mapLength
const randomMap = require('./functions/brain.js').randomMap

const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});

var db_maps = new PouchDB('DB_Maps')

readline.on('line', (input) => {
	//addMap(1436913, function (msg) { console.log("hmm", msg) })

	//addMap(["osu", "tech", 115193], function (msg) { console.log(msg) })
	
	/*getDefaultMode("AuracleTech", function(mode) {
        randomMap(["tech"], "osu", function (err, map) {
            if (map == null || map.length == 0) {
                console.log('Sorry, no match was found with these criterias.')
                return
            }
            console.log(`[https://osu.ppy.sh/b/${map.id} ${map.artist} - ${map.title} [${map.version}]] | ${map.genre[0].toUpperCase() + map.genre.slice(1)} | ${mapRating(map.rating)} ★ | ${mapLength(map.length)} ♪ | BPM: ${map.bpm}`)
        })
    })*/

    /*db_maps.allDocs({ include_docs: true, descending: true }, (err, doc) => {
	    doc.rows.forEach(e => {
	        console.log(e.doc);
	    });
	}).catch((err) => {
	    console.error(err);
	})

	db_maps.get('280751f6').then(function(doc) {
	  console.log("MEME", doc)
	}).catch((err) => {
	    console.error(err);
	})*/
});