// Importing Modules

const node_osu = require('node-osu')
let api_osu = new node_osu.Api(process.env.API_KEY, { notFoundAsError: false, completeScores: true })
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
module.exports.getBeatmaps = async (beatmapSetId = null, beatmapId = null, gamemode = null, mods = 0) => {
	let request = { mods: mods }
	if (gamemode) request.m = enum_gamemodes.getBinary(gamemode)
	if (beatmapSetId)
		request.s = beatmapSetId
	else
		request.b = beatmapId
	return api_osu.getBeatmaps(request)
}

/**
* Download a beatmaps using ID
* @param {Number} ID : the ID of the map
* @param {String} filename : desired filename
*/
module.exports.downloadBeatmap = async (ID, filename) => {
	const url = `https://osu.ppy.sh/osu/${ID}`
	const writer = fs.createWriteStream(`${tempFolder}${filename}.osu`)
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