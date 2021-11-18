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
* If customerCommands.customerCommand !onTopPlaysCooldown(username)) getTopScores(username)
* Deletes .osu files after calculating performances
* Register Top Scores
* Database Manager
* CMD settings
* CMD recommend
* CMD complain
* CMD bomb
* CMD add
* customerCommands.doAction Detect if another command than NP was used
* customerCommands.customerCommand Advanced logging system using text files
* argsFinder.findGamemodesFromNP Change standard depending on the user's default settings
* customerCommands.doAction Better way of splitting into arguments
*
*                                TOTEST
*
*/

// Debug Mode - Disable the IRC until the bot is fully functional
const debugMode = false
exports.tempFolder = './temp/'

// Importing Modules
require('dotenv').config();
const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout })
const customerCommands = require('./customerCommands')
const consoleCommands = require('./consoleCommands')
const log = require('./utils').log
const Banchojs = require('bancho.js')
const fs = require('fs')

// Log in BanchoBot IRC
const client = new Banchojs.BanchoClient({ username: process.env.IRC_USERNAME, password: process.env.IRC_PASSWORD })
client.commands = new Map()

// Register Commands
fs.readdir('./Commands/', (err, files) => {
    if (err) return log(err, 3)
    let jsfile = files.filter(f => f.split('.').pop() === 'js')
    if (jsfile.length <= 0) return log('No commands found', 3)
    jsfile.forEach((f, i) => {
        let props = require(`./Commands/${f}`)
        client.commands.set(props.help.name, props)
        client.commands.set(props.help.alias, props)
        log(`Loaded ${f}`)
    })
})

// Managing Temporary folder
if (!fs.existsSync(this.tempFolder)) fs.mkdirSync(this.tempFolder)
for (let file of fs.readdirSync(this.tempFolder)) fs.unlinkSync(`${this.tempFolder}${file}`)

// Register Bancho Events
if (!debugMode)
    client.connect().then(() => {
        log('Logged in')
        client.on('PM', async instance => customerCommands(instance, client))
    })

// Command Consoles
readline.on('line', async input => consoleCommands(input, client))

// Catch Exceptions
process.on('uncaughtException', err => { log(`Caught exception: ${err.stack}`, 3) })