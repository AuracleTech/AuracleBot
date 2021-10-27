// Importing Modules

const log = require('./utils.js').log

// Read Commands
async function consoleCommand(input, client, debugMode) {
    let message = {}
    message.user = []
    message.user.ircUsername = 'Auracle'
    message.message = input
    let args = input.split(' ')
    let command = args[0].toLowerCase()
    args.shift()
    if (debugMode) {
        log('Initialization', 4)
        await laboratory(input, client, command, message, args)
        return log('Finished', 4)
    }
    if (client.commands.get(command)) return client.commands.get(command).run(message, args, (function (msg) { log(msg, 1) }))
    return log('Command unavailable.', 1)
}

// Importing Modules Temporarily



// Test your WIP functions and commands here
async function laboratory (input, client, command, message, args) {
    if (client.commands.get(command)) client.commands.get(command).run(message, args, (function (msg) { log(msg, 4) }))
}

exports.consoleCommand = consoleCommand
/*

var PouchDB = require('pouchdb-node')
var db_maps = new PouchDB('DB_Maps')
var db_settings = new PouchDB('DB_Settings')
const addMap = require('./functions/brain.js').addMap
const getRandomMaps = require('./functions/brain.js').getRandomMaps
const setSettings = require('./functions/brain.js').setSettings
const calcPerf = require('./functions/brain.js').calcPerf

FOR ON FIRST TIME MSG

const { APIKEY } = require('./config.json')
    const osu = require('node-osu') //For all osu API related operations
    var osuApi = new osu.Api(APIKEY, { notFoundAsError: false, completeScores: true })

    var gamemode = 'osu'

    const getBeatmaps = require('./functions/brain.js').getBeatmaps
    const mapRating = require('./functions/brain.js').mapRating
    const osu_mods = require('./enums/mods.js') //Everything about osu mods

    await osuApi.getUserBest({ u: 'Auracle' }).then(async topscores => {
        
        for (let score of topscores) {
            scores.register(score)
            beatmaps.register(score._beatmap)
        }
    })




*/


/*
	DETERMINE AVERAGE STAR RATING PLAYED

const { APIKEY } = require('./config.json')
const osu = require('node-osu') //For all osu API related operations
var osuApi = new osu.Api(APIKEY, { notFoundAsError: false, completeScores: true })

var gamemode = 'osu'

const getBeatmaps = require('./functions/brain.js').getBeatmaps
const mapRating = require('./functions/brain.js').mapRating
const osu_mods = require('./enums/mods.js') //Everything about osu mods

await osuApi.getUserBest({ u: 'Auracle' }).then(async scores => {
    let averageStarPlayed = 3, preMedian = 0
    for (let score of scores) {
        let activeMods = []
        let modsRawToBinaries = osu_mods.rawToArray(score.raw_mods)
        for (let mod of modsRawToBinaries) if (osu_mods.doesAffectStarRating(mod)) activeMods.push(mod)
        var beatmap = await getBeatmaps(null, score._beatmap.id, gamemode, activeMods)
        console.log(`Rating of ${beatmap[0].difficulty.rating} star`)
        preMedian += parseFloat(beatmap[0].difficulty.rating)
    }
    console.log('preMedian', preMedian)
    if(scores.length > 0) averageStarPlayed = preMedian/scores.length


    log(`Average star rating played by Auracle -> ${mapRating(averageStarPlayed)}`, 1)
})
*/


/*
	CONSOLE CMDS

let args = input.toLowerCase().slice(prefix.length).split(/ +/)
args.shift()
let command = input.split(' ')[0].toLowerCase()
switch(command) {
    case 'np':
        calcPerf(args.join(' '), function (msg) { log(msg, 1) })
        break
    case 'r':
        getRandomMaps(args, function (msg) { log(msg) }, 1)
        break
    case 'a':
        addMap(args, function (msg) { log(msg) })
        break
    case 's':
        setSettings('AuracleTech', args, function (msg) { log(msg) })
        break
    case 'infos':
        db_maps.info().then(async function (info) { log(`${info.doc_count} maps in maps database`) })
        db_settings.info().then(async function (info) { log(`${info.doc_count} options in the settings`) })
        break
}
*/

/*

GARBO?

const { exec } = require('child_process')




    var filePath = './pollution/Gordon.osu'
    var accuracy = ' -a 100'
    var mods = ' -m HR'
    var gamemode = 'osu'

//./osu-tools-master/PerformanceCalculator/bin/Release/net5.0/PerformanceCalculator.exe simulate osu -a 100 './pollution/Gordon.osu' -j -m HR

console.time('TEST ASYNC')

    for(i in new Array(3).fill())
    exec(`'./osu-tools-master/PerformanceCalculator/bin/Release/net5.0/PerformanceCalculator.exe' simulate ${gamemode}${accuracy} '${filePath}' -j${mods}`, (error, stdout, stderr) => {
        console.time('Calc PP')
        if (error) { log(error.message, 3); return 0 }
        if (stderr) { log(stderr, 3); return 0 }
        console.log('gaba gaga', JSON.parse(stdout))
        console.timeEnd('Calc PP')
    })
console.timeEnd('TEST ASYNC')*/