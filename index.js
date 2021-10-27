/**
*                              AAAAAAAAAAAAA
*                        AAAAAAAAAAAAAAAAAAAAAAAAA
*                    AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
*                  AAAAAAAAAAA               AAAAAAAAAAA
*                AAAAAAAAA                       AAAAAAAAA
*              AAAAAAAA                             AAAAAAAA
*            AAAAAAAA                                 AAAAAAAA
*           AAAAAAA                 AAA                 AAAAAAA
*          AAAAAAA                 AAAAA                 AAAAAAA
*          AAAAAA                 AAAAAAA                 AAAAAA
*         AAAAAA                 AAAAAAAAA                 AAAAAA
*        AAAAAAA                AAAAAAAAAAA                AAAAAAA
*        AAAAAAA               AAAAAA AAAAAA               AAAAAAA
*        AAAAAA               AAAAAA    AAAAA               AAAAAA
*        AAAAAA              AAAAAA     AAAAAA              AAAAAA
*        AAAAAAA*            AAAAAA       AAAAAA            AAAAAAA
*        AAAAAAA           AAAAAAA        AAAAAA           AAAAAAA
*         AAAAAA          AAAAAAAAAAAA     AAAAAA          AAAAAA
*          AAAAAA        AAAAAAAAAAA         AAAAA        AAAAAA
*          AAAAAAA                                       AAAAAAA
*           AAAAAAA                                     AAAAAAA
*            AAAAAAAA                                 AAAAAAAA
*              AAAAAAAA                             AAAAAAAA
*                AAAAAAAAA                       AAAAAAAAA
*                  AAAAAAAAAAA               AAAAAAAAAAA
*                    AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
*                        AAAAAAAAAAAAAAAAAAAAAAAAA
*                              AAAAAAAAAAAAA
*
*
*                               Auracle Bot
*                               2021.10.18
*
*                                  TODO
*
* Create Temp folder on startup if missing
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
*
*                                 TOTEST
* Cooldown delay on command only
* utils.formatTimeFromSecs Verify that hh-mm-ss are displayed properly, mm-ss already tested
*/

// Debug Mode - Disable the IRC & Enable Quick Consonle Command function
const debugMode = true

// Importing Modules
const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout })
const customerCommand = require('./customerCommands.js').customerCommand
const consoleCommand = require('./consoleCommands.js').consoleCommand
const { USERNAME, PASSWORD } = require('./config.json')
const log = require('./utils.js').log
const Banchojs = require('bancho.js')
const fs = require('fs')

// Log in BanchoBot IRC
const client = new Banchojs.BanchoClient({ username: USERNAME, password: PASSWORD })
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

// Clean Temp folder
for (let file of fs.readdirSync('./Temp')) if(file != '.keep') fs.unlinkSync(`./Temp/${file}`)


// Register Bancho Events
if (!debugMode)
    client.connect().then(() => {
        log('Logged in')
        client.on('PM', async (message) => customerCommand(message, client))
    })

// Command Consoles
readline.on('line', async (input) => consoleCommand(input, client, debugMode))

// Catch Exceptions
process.on('uncaughtException', function(err) { log(`Caught exception: ${err.stack}`, 3) })