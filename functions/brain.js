const { exec } = require('child_process'); //Start PerformanceCalculator.dll
var validUrl = require('valid-url'); //Verify if URL is valid on /np
const getUrls = require('get-urls'); //Retrieve beatmaps URLs from a string
var re = require('request'); //Request data from URL
const fs = require('fs'); //Save & write .osu file to calc performance
var PouchDB = require('pouchdb-node') //For database
PouchDB.plugin(require('pouchdb-upsert')); //To upsert (insert &&|| update) database
var db_maps = new PouchDB('DB_Maps') //Maps database
var db_settings = new PouchDB('DB_Settings') //User settings database
const osu_gamemodes = require("../enums/gamemodes.js") //Everything about osu gamemodes
const osu_mods = require("../enums/mods.js") //Everything about osu mods
const { APIKEY } = require('../config.json')
const osu = require('node-osu'); //For all osu API related operations
var osuApi = new osu.Api(APIKEY, { notFoundAsError: false, completeScores: true })
const download = (url, path, callback) => { re(url, (err, res, body) => { re(url).pipe(fs.createWriteStream(path)).on('close', callback); }); } //Download .osu files to calc performance

// Commands

module.exports.getRandomMaps = getRandomMaps
async function getRandomMaps(args, callback, amount = 5){

	// TODO : Estimate player star level he plays

	var argGamemodes = detectGamemodes(args)
	// TODO : Combined with a pp system
	// TODO : If pp map and mod give map with the mod args
	var argMods = detectMods(args)
	var argStarLevel = detectStarLevel(args)
	var argStatus = detectStatus(args)

	let ids = [], map, displayText = "", docs = await db_maps.allDocs({ include_docs: true })
	
	docs = docs.rows.filter(map => parseInt(map.doc.rating) >= argStarLevel.min)
	docs = docs.filter(map => parseInt(map.doc.rating) <= argStarLevel.max)
	docs = docs.filter(map => { return Object.keys(argGamemodes).every(gamemode => Object.keys(map.doc.labels).includes(gamemode)) })
	docs = docs.filter(map => { return Object.keys(argGamemodes).every(gamemode => argGamemodes[gamemode].every(genre => map.doc.labels[gamemode].includes(genre))) })
	docs = docs.filter(map => { return argStatus.every(status => map.doc.approvalStatus.toLowerCase().includes(status)) })
	if (docs.length <= 0) return callback(`No match was found with these criterias`)
	if (docs.length > 1) docs = docs.sort(() => Math.random() - Math.random()).slice(0, amount)
	
	for (let map of docs)
		if (docs.length <= 1) displayText = `[https://osu.ppy.sh/b/${map.doc.id} ${map.doc.artist} - ${map.doc.title} [${map.doc.version}]] | ${Object.values(map.doc.labels).join(" ")} | ${mapRating(map.doc.rating)} ★ | ${mapLength(map.doc.length)} ♪ | BPM: ${map.doc.bpm}`
		else displayText += `[https://osu.ppy.sh/b/${map.doc.id} ${mapRating(map.doc.rating)} ★] `
	return callback(displayText)
}

module.exports.addMap = addMap
async function addMap(args, callback){

	var argGamemodes = detectGamemodes(args)
	var argMods = detectMods(args)
	var argStarLevel = detectStarLevel(args)
	var argStatus = detectStatus(args)
	var argID = detectID(args)

	var maps = await db_maps.allDocs({ include_docs: true })
	
	if(Object.keys(argGamemodes).length < 1) return callback("You need at least one gamemode. Valid gamemodes are : " + Object.keys(osu_gamemodes.gamemodes).join(' '))
	if(!argID) return callback("You need to specify a map set ID")

	// TODO : Verify if there's minimum 1 genre

	let beatmapsToAdd = []
	for (let gamemode of Object.keys(argGamemodes)) {
		var retrieveBeatmaps = await getBeatmaps(argID, null, gamemode)
		if(retrieveBeatmaps.length < 1) return callback(`Invalid beatmap set ID : No maps found on this ID for the gamemode ${gamemode}`)
		else for (let beatmap of retrieveBeatmaps) beatmapsToAdd.push(beatmap)
	}
	if(beatmapsToAdd.length < 1) return

	let alreadyPresentBeatmaps = []

	maps.rows.forEach(row => { if(row._id == `${row.beatmapSetId}#${row.id}`) alreadyPresentBeatmaps.push(row.doc.id) ;console.log("ID REE", row._id) })
	beatmapsToAdd = beatmapsToAdd.filter(function(el) { return !alreadyPresentBeatmaps.includes(el.id) })

	// TODO : Upsert map instead of insert
	for (let beatmap of beatmapsToAdd) db_maps.post({ _id: `${beatmap.beatmapSetId}#${beatmap.id}`, beatmapSetId: beatmap.beatmapSetId, labels: argGamemodes, id: beatmap.id, artist: beatmap.artist, title: beatmap.title, rating: beatmap.difficulty.rating, bpm: beatmap.bpm, length: beatmap.length.total, version: beatmap.version, approvalStatus: beatmap.approvalStatus, hash: beatmap.hash })
	return callback(`${beatmapsToAdd.length} maps upserted, total of ${Object.keys(argGamemodes).length} gamemode(s)`)
}

module.exports.setSettings = setSettings
async function setSettings(name, args, callback){
	// TODO : Add more default settings
	switch(args[0]) {
		case "gamemode":
			var argGamemodes = await detectGamemodes(args[1].split())
			if(Object.keys(argGamemodes).length < 1) { callback("You need at least one mode. Valid modes are : " + Object.keys(labels).join(' ')); break }
			argGamemodes = Object.keys(argGamemodes)[0]
			db_settings.upsert(name, function (doc) {
				doc.default_gamemode = argGamemodes
				return doc
			})
			return callback(`Default gamemode set to ${argGamemodes}`)
			break
		default:
			return callback(`Bruh what you even talkin about`)
			break
	}
}

// Functions

module.exports.getBeatmaps = getBeatmaps;
async function getBeatmaps(beatmapSetId = null, beatmapId = null, mode, mods = 0){
	if (beatmapSetId) return await osuApi.getBeatmaps({ s: beatmapSetId, m: osu_gamemodes.getBinary(mode), mods: mods })
	else return await osuApi.getBeatmaps({ b: beatmapId, m: osu_gamemodes.getBinary(mode), mods: mods })
}

// Format

module.exports.mapLength = mapLength
function mapLength(nombre){
    var heures = Math.floor(nombre / 60 / 60)
    var minutes = Math.floor(nombre / 60) - (heures * 60)
    var secondes = nombre % 60
    var duree = minutes.toString().padStart(2, '0') + ':' + secondes.toString().padStart(2, '0')
    return duree
}

module.exports.mapRating = mapRating
function mapRating(nombre){
    starRating = nombre * 100
    starRating = Math.round(starRating)
    starRating = starRating / 100
    return starRating
}

// Detection

module.exports.detectID = detectID
function detectID(args){
	for (let arg of args) if(typeof(arg) === 'number' && parseInt(arg) >= 1 && parseInt(arg) <= 10000000) return arg
}

module.exports.detectGamemodes = detectGamemodes
function detectGamemodes(args){
	var list = {}
	for (let arg of args) if (osu_gamemodes.isGamemode(arg)) list[arg] = []
	for (let gamemode of Object.keys(list))
	  for (let arg of args)
	    if (osu_gamemodes.isGenre(arg, gamemode)) list[gamemode].push(arg)
	return list
}

module.exports.detectMods = detectMods
function detectMods(args){
	var list = []
	for (let arg of args) if (osu_mods.getBinary(arg)) list.push(arg)
	return list
}

module.exports.detectStarLevel = detectStarLevel
function detectStarLevel(args){
	var list = { "min": 1, "max": 12 }
	for (let arg of args)
		if (String(arg).includes("*"))
			if (String(arg).includes("+")) list.min = (parseInt(arg) >= 1 && parseInt(arg) <= 12) ? parseInt(arg) : 1
			else if (String(arg).includes("-")) list.max = (parseInt(arg) <= 12 && parseInt(arg) >= 1) ? parseInt(arg) : 12
			else list = { "min": (parseInt(arg) >= 1 && parseInt(arg) <= 12) ? parseInt(arg) : 1, "max": (parseInt(arg) <= 12 && parseInt(arg) >= 1) ? parseInt(arg) : 12 }
	return list
}

module.exports.detectStatus = detectStatus
function detectStatus(args){
	var list = [], states = [ "loved", "qualified", "approved", "ranked", "pending", "wip", "graveyard" ]
	for (let arg of args) if (states.includes(arg)) list.push(arg)
	return list
}

// Debug

module.exports.log = log
function log(msg, level = 0){
	var emoji = { 0: "\x1b[32mInfo ›", 1: "\033[0;37mDebug ›", 2: "\x1b[33mWarning ›", 3: "\x1b[31mCritical ›" }
	console.log(`${emoji[level]}\x1b[0m ${msg}`)
}

// Performance Calculator

async function CalculatePerformancePoint(resolve, filePath, accuracy, mods = [], gamemode) {
    var modsArgs = ''
    for (let mod of mods) modsArgs += ` -m ${osu_mods.getAbbreviation(mod)}`
    var accArg = (gamemode == 'mania') ? "" : ` -a ${accuracy}`
    exec(`dotnet "./osu-tools-master/PerformanceCalculator/bin/Release/netcoreapp3.1/win10-x64/PerformanceCalculator.dll" simulate ${gamemode}${accArg} "${filePath}" -j${modsArgs.toLowerCase()}`, (error, stdout, stderr) => {
        if (error) { log(error.message, 3); return 0 }
        if (stderr) { log(stderr, 3); return 0 }
        return resolve(JSON.parse(stdout), 0)
    });
};


module.exports.calcPerf = calcPerf
async function calcPerf(command, callback){
    var urls = await getUrls(command, {requireSchemeOrWww: false})
    for (let url of urls) {
        if (!validUrl.isUri(url)) return;
        url = new URL(url);
        if (url.hostname != "osu.ppy.sh") return;
        var beatmapID = url.href.split("#");
        beatmapID = beatmapID[beatmapID.length - 1].replace(/\D/g,'');
        if(isNaN(beatmapID)) return;
        // TODO : MAKE SURE THIS SHIT WORKS SEEMS SKETCHY AF MA DOOD
        var args = command.split("+").join("-").split("-"), currentMods = [], modsPrinteable = "";
        for (let arg of args) if(osu_mods.getBinary(arg)) currentMods.push(osu_mods.getBinary(arg))
        var filePath = `./pollution/${(new Date().getTime() + ".osu")}`;

        var mode = (command.match(/(?<=\<).+?(?=\>)/)) ? (labels.hasOwnProperty(command.match(/(?<=\<).+?(?=\>)/)[0].toLowerCase()) ? command.match(/(?<=\<).+?(?=\>)/)[0].toLowerCase() : "") : ""
        var beatmap = await getBeatmaps(null, beatmapID, mode, currentMods)
        if(beatmap.length < 1) return callback(`Invalid beatmap ID : No maps avalaible on this ID for the mode`)
        mode = (beatmap[0].mode.toLowerCase() != 'standard') ? beatmap[0].mode.toLowerCase() : 'osu'

        download(`https://osu.ppy.sh/osu/${beatmapID}`, filePath, () => {
            var acc100 = new Promise((resolve, reject) => { CalculatePerformancePoint(resolve, filePath, 100, currentMods, mode) })
            // TODO : Find a better cleaner way of doing all that crap
            if (mode != "mania") {
                var acc99 = new Promise((resolve, reject) => { CalculatePerformancePoint(resolve, filePath, 99, currentMods, mode) })
                var acc98 = new Promise((resolve, reject) => { CalculatePerformancePoint(resolve, filePath, 98, currentMods, mode) })
                var acc97 = new Promise((resolve, reject) => { CalculatePerformancePoint(resolve, filePath, 97, currentMods, mode) })
                var acc95 = new Promise((resolve, reject) => { CalculatePerformancePoint(resolve, filePath, 95, currentMods, mode) })
            }

            Promise.all([acc100, acc99, acc98, acc97, acc95]).then((values) => {
                var isDoubleTime = osu_mods.hasDoubleTime(currentMods)
                // TODO : Calcul BPM and length depending on HT, NC and DT, maybe modify mapLength function
                var isHalfTime = osu_mods.hasHalfTime(currentMods)
                var duration = (isDoubleTime) ? Math.round(beatmap[0].length.total/1.5) : beatmap[0].length.total
                var bpm = (isDoubleTime) ? Math.round(beatmap[0].bpm*1.5) : beatmap[0].bpm;
                for (let mod of currentMods) modsPrinteable += `${osu_mods.getAbbreviation(mod)} `
                var AR = (mode == "osu") ? ` ${mapRating(values[0].AR)}` : ""
                var OD = (mode == "osu") ? ` ${mapRating(values[0].OD)}` : ""
                if(mode == 'mania') return callback(`[https://osu.ppy.sh/b/${beatmap[0].id} ${beatmap[0].artist} - ${beatmap[0].title} [${beatmap[0].version}]] ${modsPrinteable}| ${mode.toUpperCase()} | 100% ${Math.round(values[0].pp)}pp | ${mapLength(duration)} ★${mapRating(beatmap[0].difficulty.rating)} ♫${bpm} AR${AR} OD${OD}`)
                else return callback(`[https://osu.ppy.sh/b/${beatmap[0].id} ${beatmap[0].artist} - ${beatmap[0].title} [${beatmap[0].version}]] ${modsPrinteable}| ${mode.toUpperCase()} | 95% ${Math.round(values[4].pp)}pp | 97% ${Math.round(values[3].pp)}pp | 98% ${Math.round(values[2].pp)}pp | 99% ${Math.round(values[1].pp)}pp | 100% ${Math.round(values[0].pp)}pp | ${mapLength(duration)} ★${mapRating(beatmap[0].difficulty.rating)} ♫${bpm} AR${AR} OD${OD}`)
            })
        })
    }
}