// Importing Modules
const performanceManager = require('../performanceManager')
const utils = require('../utils')
const enum_mods = require('../enums/mods')
const argsFinder = require('../argsFinder')
const beatmapsManager = require('../beatmapsManager')

module.exports.help = { name: 'np', alias: 'n' }
module.exports.run = async (_instance, args, callback) => {
	let IDs = argsFinder.findIDsFromLink(args)
	if (IDs.beatmapID == -1) return callback(`Impossible to find any beatmap ID`)
	let search = argsFinder.findGamemodesFromNP(args)
	let results = await performanceManager.calculatePerformance(IDs.beatmapID, search.gamemode, search.mods)
	let beatmap = await beatmapsManager.getBeatmaps(null, IDs.beatmapID, search.gamemode, search.mods)
	if (beatmap.length < 1) return callback(`The beatmap ID ${IDs.beatmapID} is not valid`)
	beatmap = beatmap[0]
	let gamemode = beatmap.mode == 'Standard' ? 'osu' : beatmap.mode
	let isDT = enum_mods.hasDoubleTime(search.mods)
	let isHT = enum_mods.hasHalfTime(search.mods)
	let duration = (isDT) ? Math.round(beatmap.length.total / 1.5) : (isHT) ? Math.round(beatmap.length.total * 1.3333) : beatmap.length.total
	let bpm = (isDT) ? Math.round(beatmap.bpm * 1.5) : (isHT) ? Math.round(beatmap.bpm * 1.3333) : beatmap.bpm
	let printMods = ''
	for (let mod of search.mods) printMods += `${enum_mods.getAbbreviation(mod)} `
	let AR_OD = (gamemode == 'osu') ? ` AR${results[0].AR.toFixed(1)} OD${results[0].OD.toFixed(1)}` : ''
	let acc = `100% ${results[0].pp}`
	if (gamemode != 'mania') acc = `95% ${Math.round(results[4].pp)}pp | 97% ${Math.round(results[3].pp)}pp | 98% ${Math.round(results[2].pp)}pp | 99% ${Math.round(results[1].pp)}pp | 100% ${Math.round(results[0].pp)}pp`
	return callback(`[https://osu.ppy.sh/b/${beatmap.id} ${beatmap.artist} - ${beatmap.title} [${beatmap.version}]] ${gamemode.toUpperCase()} ${printMods}| ${acc} | ${utils.formatTimeFromSecs(duration)} ★${parseFloat(beatmap.difficulty.rating).toFixed(2)} ♫${bpm}${AR_OD}`)
}