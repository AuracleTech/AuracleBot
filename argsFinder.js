// Importing Modules

const getBeatmaps = require('./beatmapsManager.js').getBeatmaps
const enum_gamemodes = require('./enums/gamemodes.js')
const enum_mods = require('./enums/mods.js')
const get_urls = require('get-urls')
var valid_url = require('valid-url')

// Find IDs
function findID (args) {
	let found = []
	for (let arg of args) if (isBeatmapID(arg)) found.push(arg)
	return found
}

// Detect Gamemodes and Genres
function findGamemodes (args) {
	let found = {}
	for (let arg of args) if (enum_gamemodes.isGamemode(arg)) found[arg] = []
	for (let gamemode of Object.keys(found))
	  for (let arg of args)
	    if (enum_gamemodes.isGenre(arg, gamemode)) found[gamemode].push(arg)
	return found
}

// Detect Mods
function findMods (args) {
	let found = []
	for (let arg of args) if (enum_mods.getBinary(arg)) found.push(arg)
	return found
}

// Detect star rating
function findRatings (args) {
	let found = { min: 1, max: 20 }
	for (let arg of args)
		if (String(arg).includes('*'))
			if (String(arg).includes('+')) found.min = (parseInt(arg) >= 1 && parseInt(arg) <= 20) ? parseInt(arg) : 1
			else if (String(arg).includes('-')) found.max = (parseInt(arg) <= 20 && parseInt(arg) >= 1) ? parseInt(arg) : 20
			else found = { min: (parseInt(arg) >= 1 && parseInt(arg) <= 20) ? parseInt(arg) : 1, max: (parseInt(arg) <= 20 && parseInt(arg) >= 1) ? parseInt(arg) : 20 }
	return found
}

// Detect the statuses
function findStatuses (args) {
	let states = [ 'loved', 'qualified', 'approved', 'ranked', 'pending', 'wip', 'graveyard' ]
	for (let arg of args) if (states.includes(arg)) found.push(arg)
	return found
}

// Detect the set ID and ID of beatmaps in links
function findIDsFromLink (args) {
	let found = { beatmapSetID: -1, beatmapID: -1 }
	let invalidUrls = get_urls(args.join(" "), { requireSchemeOrWww: false })
	for (let invalidUrl of invalidUrls)
		if (valid_url.isUri(invalidUrl)) {
			let url = new URL(invalidUrl)
			if (url.hostname == 'osu.ppy.sh') {
				if (url.href.includes('#')) {
					let IDs = url.href.replace(/[^#0-9]/g, '').split('#')
					if (isBeatmapID(IDs[0])) found.beatmapSetID = IDs[0]
					if (isBeatmapID(IDs[1]))	found.beatmapID = IDs[1]
				} else if (isBeatmapID(url.href.replace(/[^#0-9]/g, ''))) found.beatmapID = url.href.replace(/[^#0-9]/g, '')
			}
		}
	return found
}

// TODO : Change standard depending on the user's default settings
// Detect gamemodes and mods from the NP sentence
function findGamemodesFromNP (args) {
	args = args.join(' ').split('+').join('-').split('-')
	let found = { mods: [], gamemode: 'osu' }
	let search = args.join(' ').match(/#.*\//)
	if(search[0].length > 0)
		if(enum_gamemodes.isGamemode(search[0].replace(/[^a-zA-Z0-9]+/g, '')))
		found.gamemode = search[0].replace(/[^a-zA-Z0-9]+/g, '')
	for (let arg of args)
		if (enum_mods.getBinary(arg)) found.mods.push(enum_mods.getBinary(arg))
		else if (enum_gamemodes.isGamemode(arg.replace('<', '').replace('>', ''))) found.gamemode = arg
	return found
}


// Check if arg could be a map ID
function isBeatmapID (arg, gamemode = null) {
	return !isNaN(arg) && !arg.includes(',') && parseInt(arg) !== null && parseInt(arg) >= 1 && parseInt(arg) <= 10000000
}

module.exports.findIDsFromLink = findIDsFromLink
module.exports.findGamemodesFromNP = findGamemodesFromNP