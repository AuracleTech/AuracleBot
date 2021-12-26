// Importing Modules
require('dotenv').config();
const readline = require('readline')
const console = readline.createInterface({ input: process.stdin, output: process.stdout })
const customerCommands = require('./customerCommands')
const consoleCommands = require('./consoleCommands')
const log = require('./utils').log
const Banchojs = require('bancho.js')
const fs = require('fs')
const client = new Banchojs.BanchoClient({ username: process.env.IRC_USERNAME, password: process.env.IRC_PASSWORD, apiKey: process.env.API_KEY, host: 'irc.ppy.sh', port: 6667, ssl: false })
let PouchDB = require('pouchdb-node')
PouchDB.plugin(require('pouchdb-upsert'))

// Variables
const disableIRC = false
exports.tempFolder = './temp/'
exports.db_scores = new PouchDB('DB/DB_Scores')
exports.db_beatmaps = new PouchDB('DB/DB_Beatmaps')
exports.db_settings = new PouchDB('DB/DB_Settings')
exports.minimumCooldownTopScores = 2
client.commands = new Map()

// Register Commands
fs.readdir('./Commands/', (err, files) => {
    if (err) return log(`${this.filename}.fs.readdir ${err}`, 3)
    let jsFiles = files.filter(file => file.split('.').pop() === 'js')
    if (jsFiles.length <= 0) return log('No command files found', 3)
    jsFiles.forEach(file => {
        let cmdFile = require(`./Commands/${file}`)
        client.commands.set(cmdFile.help.name, cmdFile)
        client.commands.set(cmdFile.help.alias, cmdFile)
        log(`Loaded ${file}`)
    })
})

// Managing Temporary folder
if (!fs.existsSync(this.tempFolder)) fs.mkdirSync(this.tempFolder)
for (let file of fs.readdirSync(this.tempFolder)) fs.unlinkSync(`${this.tempFolder}${file}`)

// Connection to bancho
if (!disableIRC)
    client.connect().then(() => {
        log('Logged in')
        client.on('PM', async instance => customerCommands(instance, client))
    })

// Command Consoles
console.on('line', async input => {
    readline.moveCursor(process.stdout, 0, -1)
    readline.clearLine(process.stdout, 1)
    consoleCommands(input, client)
})

// Catch Exceptions
process.on('uncaughtException', err => log(`${this.filename}.uncaughtException ${err}`, 3))