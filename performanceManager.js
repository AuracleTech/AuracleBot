// Importing Modules

const beatmapsManager = require('./beatmapsManager')
const enum_mods = require('./enums/mods')
const log = require('./utils').log
const execFile = require('child_process').execFile
const index = require('./index')

module.exports.calculatePerformance = async (mapID, gamemode, mods = []) => {
	let filename = new Date().getTime()
	let accs = [100, 99, 98, 97, 95]
	if (gamemode == 'mania') accs = [100]
	await beatmapsManager.downloadBeatmap(mapID, filename)
	let results = []
	for (let acc of accs)
		results.push(await launchPerformanceCalculator(filename, acc, gamemode, mods))
	return results
}

launchPerformanceCalculator = async (filename, acc, gamemode, mods = []) => {
	return new Promise((resolve, reject) => {
		let args = [ 'simulate', gamemode, '-a', acc, `${index.tempFolder}${filename}.osu`, '-j' ]
		for (let mod of mods) args.push('-m', enum_mods.getAbbreviation(mod).toLowerCase())
	    execFile('./osu-tools-master/PerformanceCalculator/bin/Release/net5.0/PerformanceCalculator.exe', args, (err, stdout, stderr) => {
        if (err) {
			log(`${this.filename}.launchPerformanceCalculator ${stderr}`, 3)
			return reject(stderr)
        }
        return resolve(JSON.parse(stdout))
	    })
	})
}