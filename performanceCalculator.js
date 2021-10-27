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

/*
RESULTS [
  {
    Beatmap: "Katakiri Rekka & Suzuyu - Girl meets Love (sukiNathan) [xxdeathx's Shiranui]",
    Statistics: { Accuracy: 100, Combo: 582, Great: 441, Ok: 0, Meh: 0, Miss: 0 },
    Aim: 88.31418986541831,
    Speed: 54.52572278305832,
    Accuracy: 69.9116963034392,
    Flashlight: 0,
    OD: 8.5,
    AR: 9.306666666666667,
    'Max Combo': 582,
    Mods: 'None',
    pp: 216.04317036132005
  },
  {
    Beatmap: "Katakiri Rekka & Suzuyu - Girl meets Love (sukiNathan) [xxdeathx's Shiranui]",
    Statistics: {
      Accuracy: 99.01738473167045,
      Combo: 582,
      Great: 435,
      Ok: 4,
      Meh: 2,
      Miss: 0
    },
    Aim: 87.88029550855873,
    Speed: 51.751928515613116,
    Accuracy: 49.30562737040909,
    Flashlight: 0,
    OD: 8.5,
    AR: 9.306666666666667,
    'Max Combo': 582,
    Mods: 'None',
    pp: 192.21463915759134
  },
  {
    Beatmap: "Katakiri Rekka & Suzuyu - Girl meets Love (sukiNathan) [xxdeathx's Shiranui]",
    Statistics: {
      Accuracy: 97.99697656840513,
      Combo: 582,
      Great: 430,
      Ok: 2,
      Meh: 9,
      Miss: 0
    },
    Aim: 87.42971290720456,
    Speed: 43.55246540404424,
    Accuracy: 34.12238956542022,
    Flashlight: 0,
    OD: 8.5,
    AR: 9.306666666666667,
    'Max Combo': 582,
    Mods: 'None',
    pp: 168.76118896120028
  },
  {
    Beatmap: "Katakiri Rekka & Suzuyu - Girl meets Love (sukiNathan) [xxdeathx's Shiranui]",
    Statistics: {
      Accuracy: 97.01436130007559,
      Combo: 582,
      Great: 425,
      Ok: 1,
      Meh: 15,
      Miss: 0
    },
    Aim: 86.99581855034498,
    Speed: 37.43167438455191,
    Accuracy: 23.809518083061064,
    Flashlight: 0,
    OD: 8.5,
    AR: 9.306666666666667,
    'Max Combo': 582,
    Mods: 'None',
    pp: 152.41915033223538
  },
  {
    Beatmap: "Katakiri Rekka & Suzuyu - Girl meets Love (sukiNathan) [xxdeathx's Shiranui]",
    Statistics: {
      Accuracy: 95.01133786848072,
      Combo: 582,
      Great: 414,
      Ok: 3,
      Meh: 24,
      Miss: 0
    },
    Aim: 86.11134159213123,
    Speed: 29.31515194698199,
    Accuracy: 11.238667652206079,
    Flashlight: 0,
    OD: 8.5,
    AR: 9.306666666666667,
    'Max Combo': 582,
    Mods: 'None',
    pp: 131.98569656372248
  }
]
BEATMAP DATA Beatmap {
  id: '744222',
  beatmapSetId: '333947',
  hash: '36598b288bff591ec140c0fb49f96fa5',
  title: 'Girl meets Love',
  creator: 'sukiNathan',
  version: "xxdeathx's Shiranui",
  source: '花咲ワークスプリング！',
  artist: 'Katakiri Rekka & Suzuyu',
  genre: 'Video Game',
  language: 'Japanese',
  rating: '9.40038',
  bpm: '185',
  mode: 'Standard',
  tags: [
    'hana',      'saki',
    'work',      'spring!',
    'opening',   'game',
    'visual',    'novel',
    'saga',      'planets',
    'vinxis',    'hvick225',
    'hvick',     'xxdeathx',
    'snowwhite'
  ],
  approvalStatus: 'Ranked',
  raw_submitDate: '2015-07-13 22:37:26',
  raw_approvedDate: '2015-08-21 09:40:14',
  raw_lastUpdate: '2015-08-13 15:02:06',
  maxCombo: '582',
  objects: { normal: '300', slider: '141', spinner: '0' },
  difficulty: {
    rating: '5.38526',
    aim: '2.80169',
    speed: '2.36545',
    size: '4',
    overall: '8.5',
    approach: '9.3',
    drain: '5.5'
  },
  length: { total: '98', drain: '98' },
  counts: {
    favorites: '428',
    favourites: '428',
    plays: '1613334',
    passes: '233786'
  },
  hasDownload: true,
  hasAudio: true
}
*/