// Importing Modules

const { APIKEY } = require('./config.json')
const node_osu = require('node-osu')
var api_osu = new node_osu.Api(APIKEY, { notFoundAsError: false, completeScores: true })
const enum_gamemodes = require('./enums/gamemodes.js')
const enum_mods = require('./enums/mods.js')
const log = require('./utils.js').log
const axios = require('axios')
const fs = require('fs')

/**
* Retrieve beatmaps using ID or SetID
* @param {Number} beatmapSetId : the ID of the set (optional)
* @param {Number} beatmapId : the ID of the map (optional)
* @param {Number} gamemode : gamemode desired (binary)
* @param {Array} mods : mods desired (array of binaries)
*/
async function getBeatmaps (beatmapSetId = null, beatmapId = null, gamemode = null, mods = 0) {
	let request = { mods: mods }
	if (gamemode) request.m = enum_gamemodes.getBinary(gamemode)
	if (beatmapSetId)
		request.s = beatmapSetId
	else
		request.b = beatmapId
	return api_osu.getBeatmaps(request)
}

async function downloadBeatmap (ID, filename) {
	const url = `https://osu.ppy.sh/osu/${ID}`
	const writer = fs.createWriteStream(`./Temp/${filename}.osu`)
	const response = await axios({
		url,
		method: 'GET',
		responseType: 'stream'
	})
	response.data.pipe(writer)
	return new Promise((resolve, reject) => {
		writer.on('finish', resolve)
		writer.on('error', reject)
	})
}

module.exports.getBeatmaps = getBeatmaps
module.exports.downloadBeatmap = downloadBeatmap








/*


var PouchDB = require('pouchdb-node') //For database
PouchDB.plugin(require('pouchdb-upsert')) //To upsert (insert &&|| update) database
var db_maps = new PouchDB('DB_Maps') //Maps database
var db_settings = new PouchDB('DB_Settings') //User settings database

module.exports.getRandomMaps = getRandomMaps
async function getRandomMaps(args, callback, amount = 5){
	// TODO : Estimate player star level he plays
	var argGamemodes = detectGamemodes(args)
	// TODO : Combined with a pp system
	// TODO : If pp map and mod give map with the mod args
	var argMods = detectMods(args)
	var argStarLevel = detectStarLevel(args)
	var argStatus = detectStatus(args)
	// TODO : Add length argument 0:30- 0:30+

	let ids = [], map, displayText = '', docs = await db_maps.allDocs({ include_docs: true })
	
	docs = docs.rows.filter(map => parseInt(map.doc.rating) >= argStarLevel.min)
	docs = docs.filter(map => parseInt(map.doc.rating) <= argStarLevel.max)
	docs = docs.filter(map => { return Object.keys(argGamemodes).every(gamemode => Object.keys(map.doc.labels).includes(gamemode)) })
	docs = docs.filter(map => { return Object.keys(argGamemodes).every(gamemode => argGamemodes[gamemode].every(genre => map.doc.labels[gamemode].includes(genre))) })
	docs = docs.filter(map => { return argStatus.every(status => map.doc.approvalStatus.toLowerCase().includes(status)) })
	if (docs.length <= 0) return callback(`No match was found with these criterias`)
	if (docs.length > 1) docs = docs.sort(() => Math.random() - Math.random()).slice(0, amount)
	
	for (let map of docs)
		if (docs.length <= 1) displayText = `[https://osu.ppy.sh/b/${map.doc.id} ${map.doc.artist} - ${map.doc.title} [${map.doc.version}]] ${Object.values(map.doc.labels).join(' ')} | ★ ${mapRating(map.doc.rating)} | ♪ ${mapLength(map.doc.length)} | BPM ${map.doc.bpm}`
		else displayText += `[https://osu.ppy.sh/b/${map.doc.id} ${Object.values(map.doc.labels).join(' ')} | ♪ ${mapLength(map.doc.length)} | BPM ${map.doc.bpm} | ★ ${mapRating(map.doc.rating)}] `
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
	
	if (Object.keys(argGamemodes).length < 1) return callback('You need at least one gamemode. Valid gamemodes are : ' + Object.keys(osu_gamemodes.gamemodes).join(' '))
	if (!argID) return callback('You need to specify a map set ID')

	// TODO : Verify if there's minimum 1 genre

	let beatmapsToAdd = []
	for (let gamemode of Object.keys(argGamemodes)) {
		var retrieveBeatmaps = await getBeatmaps(argID, null, gamemode)
		if (retrieveBeatmaps.length < 1) return callback(`Invalid beatmap set ID : No maps found on this ID for the gamemode ${gamemode}`)
		else for (let beatmap of retrieveBeatmaps) beatmapsToAdd.push(beatmap)
	}
	if(beatmapsToAdd.length < 1) return

	let alreadyPresentBeatmaps = []

	for (let map of maps.rows) if (map._id == `${map.doc.beatmapSetId}#${map.doc.id}`) alreadyPresentBeatmaps.push(row.doc.id) // GET RID ON UPSERT UPDATE
	beatmapsToAdd = beatmapsToAdd.filter(function (el) { return !alreadyPresentBeatmaps.includes(el.id) })

	// TOTHINK : Maybe create an automatic genre application, could be usefull in a lots of ways!
	// TODO : If map BPM is >= 280 and as genre deathstream convert to hyper-deathstream
	for (let beatmap of beatmapsToAdd)
		db_maps.upsert(`${beatmap.beatmapSetId}#${beatmap.id}`, function (doc) {
			doc.beatmapSetId = beatmap.beatmapSetId
			doc.labels = argGamemodes
			doc.id = beatmap.id
			doc.artist = beatmap.artist
			doc.title = beatmap.title
			doc.rating = beatmap.difficulty.rating
			doc.bpm = beatmap.bpm
			doc.length = beatmap.length.total
			doc.version = beatmap.version
			doc.approvalStatus = beatmap.approvalStatus
			doc.hash = beatmap.hash
			return doc
		})
	return callback(`${beatmapsToAdd.length} maps upserted, total of ${Object.keys(argGamemodes).length} gamemode(s) and the following genres : ${Object.values(argGamemodes).join(' ')}`)
}
*/

/*
FIRST SCORE Score {

	_beatmap: Beatmap {
		id: '2131813',
		beatmapSetId: '894883',
		hash: '7e266a17fe737d34e731425c6af72416',
		title: 'Kani*Do-Luck! (TV Size)',
		creator: 'Azunyan-',
		version: 'Extreme!',
		source: 'あいうら',
		artist: 'Aiurabu',
		genre: 'Anime',
		language: 'Japanese',
		rating: '8.95135',
		bpm: '210',
		mode: 'Standard',
		tags: [
			'aiura',    'opening', '上原歩子',
			'uehara',   'ayuko',   '田村奈央',
			'tamura',   'nao',     '岩沢彩生',
			'iwasawa',  'saki',    '飯田友子',
			'iida',     'yuuko',   '天谷奏香',
			'amaya',    'kanaka',  '中島唯',
			'nakajima', 'yui',     'crab',
			'japanese', 'anime',   'short',
			'xexyz'
		],
		approvalStatus: 'Ranked',
		raw_submitDate: '2018-12-17 02:36:20',
		raw_approvedDate: '2019-08-26 05:00:02',
		raw_lastUpdate: '2019-08-18 09:22:05',
		maxCombo: '374',
		objects: { normal: '142', slider: '112', spinner: '1' },
		difficulty: {
			rating: '6.06146',
			aim: '3.24364',
			speed: '2.392',
			size: '3.5',
			overall: '9.2',
			approach: '9.4',
			drain: '6'
		},
		length: { total: '59', drain: '59' },
		counts: {
			favorites: '2341',
			favourites: '2341',
			plays: '3383073',
			passes: '465489'
		},
		hasDownload: true,
		hasAudio: true
	}
}
>
*/

// Detect from np string