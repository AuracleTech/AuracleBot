// Importing Modules

const downloadBeatmap = require('./beatmapsManager.js').downloadBeatmap
const enum_mods = require('./enums/mods.js')
const { exec } = require('child_process')
const log = require('./utils.js').log
const execFile = require('child_process').execFile

async function calculatePerformance (mapID, gamemode, mods = []) {
	let filename = new Date().getTime()
	let accs = [100, 99, 98, 97, 95]
	if (gamemode == 'mania') accs = [100]
	let download = await downloadBeatmap(mapID, filename)
	let results = []
	for (let acc of accs)
		results.push(await launchPerformanceCalculator(filename, acc, gamemode, mods))
	return results
}

async function launchPerformanceCalculator (filename, acc, gamemode, mods = []) {
	return new Promise((resolve, reject) => {
		let args = [ 'simulate', gamemode, '-a', acc, `./Temp/${filename}.osu`, '-j' ]
		for (let mod of mods) args.push('-m', enum_mods.getAbbreviation(mod).toLowerCase())
	    const child = execFile('./osu-tools-master/PerformanceCalculator/bin/Release/net5.0/PerformanceCalculator.exe', args, (err, stdout, stderr) => {
        if (err) {
          log(stderr, 3)
          return reject(stderr)
        }
        return resolve(JSON.parse(stdout))
	    })
	})
}

module.exports.calculatePerformance = calculatePerformance