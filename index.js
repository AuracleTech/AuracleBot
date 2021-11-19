/**
*                           AAAAAAAAAAAAAAAAAA
*                     AAAAAAAAA            AAAAAAAAA
*                 AAAAAA                          AAAAAA
*              AAAA                                    AAAA
*           AAAA                                          AAAA
*         AAAA                                              AAAA
*       AAAA                                                  AAAA
*      AAA                                                      AAA
*     AAA                                                        AAA
*    AAA                                                          AAA
*   AAA                          AAAAAAAA                          AAA
*  AAA                         AAAAA  AAAAA                         AAA
*  AAA                       AAAAA      AAAAA                       AAA
*  AAA                      AAAA          AAAA                      AAA
*  AAA                    AAAA      AA      AAAA                    AAA
*  AAA                  AAAA       AAAA       AAAA                  AAA
*  AAA                 AAAA                    AAAA                 AAA
*   AAA                                                            AAA
*    AAA                                                          AAA
*     AAA                                                        AAA
*      AAA                                                      AAA
*       AAAA                                                  AAAA
*         AAAA                                              AAAA
*           AAAA                                          AAAA
*              AAAA                                    AAAA
*                AAAAAA                            AAAAAA
*                     AAAAAAAAA            AAAAAAAAA
*                           AAAAAAAAAAAAAAAAAA
*
*                              Auracle Bot
*                              2021.10.18
*
*                                 TODO
* make scoresManager.getTopScores
* Add proper description to db.get and upsert
* If customerCommands.customerCommand !onTopPlaysCooldown(username)) getTopScores(username)
* Deletes .osu files after calculating performances
* Register Top Scores
* Database Manager
* CMD settings
* CMD recommend
* CMD bomb
* CMD add
* customerCommands.doAction Detect if another command than NP was used
* customerCommands.customerCommand Advanced logging system using text files
* argsFinder.findGamemodesFromNP Change standard depending on the user's default settings
* customerCommands.doAction Better way of splitting into arguments
*
*                                TOTEST
* !c
* !ping
* !help
*/

// Importing Modules
require('dotenv').config();
const readline = require('readline')
const console = readline.createInterface({ input: process.stdin, output: process.stdout })
const customerCommands = require('./customerCommands')
const consoleCommands = require('./consoleCommands')
const log = require('./utils').log
const Banchojs = require('bancho.js')
const fs = require('fs')
const client = new Banchojs.BanchoClient({ username: process.env.IRC_USERNAME, password: process.env.IRC_PASSWORD })

// Variables
const disableIRC = false
exports.tempFolder = './temp/'

// Log in BanchoBot IRC
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

// Register Bancho Events
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