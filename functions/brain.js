var PouchDB = require('pouchdb-node')
var db_maps = new PouchDB('DB_Maps')
var db_settings = new PouchDB('DB_Settings')
const labels = require("../labels.json")
const modesToAPI = { osu: 0, taiko: 1, ctb: 2, mania: 3 }

async function getRandomMap(args, callback) {

	var criterias = getCriterias(args);

	let map, ids = [], docs = await db_maps.allDocs({ include_docs: true })

	docs.rows.forEach(row => {
		criterias.forEach(mode => {
			if(row.doc.labels.hasOwnProperty(mode)) {
				if(criterias[mode].length > 0) {
					criterias[mode].forEach(genre => { if(row.doc.labels.includes(genre)) ids.push(row.doc._id) })
				} else ids.push(row.doc._id)
			}
		})
	})

	if(ids.length < 1) return callback(`No match was found with these criterias`)
	map = await db_maps.get(ids[Math.floor(Math.random() * ids.length)])
	return callback(`[https://osu.ppy.sh/b/${map.id} ${map.artist} - ${map.title} [${map.version}]] | ${map.genre.join(" ")} | ${mapRating(map.rating)} ★ | ${mapLength(map.length)} ♪ | BPM: ${map.bpm}`)
	/*TODO map.doc.artist.toLowerCase().includes(criteria.toLowerCase()) ||
	map.doc.title.toLowerCase().includes(criteria.toLowerCase())
	if (criteria < 10 && criteria > 0)
	maps = maps.filter((map) => Math.floor(map.doc.rating) == criteria);
	maps = maps.filter((map) => Math.ceil(map.doc.bpm / 10) * 10 == criteria);*/
}
module.exports.getRandomMap = getRandomMap

async function bombRandomMap(args, mode, callback) {

	db_maps.allDocs({mode : mode}, function (err, res) {
		if (!args || args.length == 0) {
			db_maps.allDocs({}, function (err, res) {
				let maps = diffs;

				let randoms = [];
				let timeout = 0;
				do {
					timeout++;
					if (timeout > 19) {
						break;
					}
					let random = res.rows[Math.floor(Math.random() * res.rows.length)];
					let map = maps.filter((map) => map.id == random.main_diff);
					randoms.push(map[0]);
				} while (randoms.length < 3);

				if (err) callback(err, null)
				else callback(null, randoms)
			})
		} else {
			db_maps.allDocs({mode : mode}, function (err, res) {
				let maps = diffs;
				args.forEach((criteria) => {
					if (isNaN(criteria)) {
						if (
							labels.osu.includes(criteria) ||
							labels.mania.includes(criteria)
						) {
							if (mode == "osu") {
								if (labels.osu.includes(criteria)) {
									maps = maps.filter((map) => map.genre == criteria);
								}
							}
							if (mode == "mania") {
								if (labels.mania.includes(criteria)) {
									maps = maps.filter((map) => map.genre == criteria);
								}
							}
						} else {
							let allM = res.rows;
							allM = Object.values(allM).filter(
								(map) =>
									(map.artist
										.toLowerCase()
										.includes(criteria.toLowerCase()) &&
										map.labels == mode) ||
									map.title.toLowerCase().includes(criteria.toLowerCase())
							);
							let newMaps = [];
							diffs = [];
							allM.forEach((e) => {
								diffs.push(e.main_diff);
							});
							maps.forEach((m) => {
								if (diffs.includes(m.id)) {
									newMaps.push(m);
								}
							});
							maps = newMaps;
						}
					} else {
						if (criteria < 10 && criteria > 0) {
							maps = maps.filter((map) => Math.floor(map.rating) == criteria);
						} else {
							maps = maps.filter(
								(map) => Math.ceil(map.bpm / 10) * 10 == criteria
							);
						}
					}
				});
				let randomDiff = null;
				let randoms = [];
				if (maps.length != 0) {
					let timeout = 0;
					do {
						timeout++;
						if (timeout > 19) {
							break;
						}
						let random = maps[Math.floor(Math.random() * maps.length)];
						if (!randoms.includes(random)) {
							randoms.push(random);
						}
					} while (randoms.length < 3);
				}
				if (err) callback(err, null)
				else callback(null, randoms)
			})
		}
	})
}
module.exports.bombRandomMap = bombRandomMap

module.exports.addMap = addMap
async function addMap(args, callback) {

	var criterias = getCriterias(args)
	var hasGenreSpecified = false, id = false, beatmapsDB = await db_maps.allDocs({ include_docs: true }), newBeatmaps
	criterias.forEach(mode => { if(mode.length > 0) hasGenreSpecified = true })

	if(!hasGenreSpecified) return callback("You need at least one genre. Valid genres are : " + labels[mode].join(' '))

	args.forEach(arg => { if(typeof(arg) === 'number') id = arg })

	if(!id) return callback("You need to specify a map set ID")

	criterias.forEach(mode => {	newBeatmaps.push(getBeatmaps(id, mode)) })
	if(beatmaps.length < 1) return callback("Invalid beatmap set ID : No maps found");

	beatmapsDB.rows.forEach(row => { if(row.doc.beatmapSetId == beatmapSetId) mapsAlreadyInDB.push(row.doc.id) })
	//.catch((err) => { console.error("Error Brain.alreadyPresentMaps:" + err) })
	newBeatmaps.forEach(async function(beatmap) {
		if(!beatmapsDB.includes(beatmap.id))
    		await db_maps.post({ _id: beatmap.hash, beatmapSetId: beatmap.beatmapSetId, labels: labels, id: beatmap.id, artist: beatmap.artist, title: beatmap.title, rating: beatmap.difficulty.rating, bpm: beatmap.bpm, length: beatmap.length.total, version: beatmap.version, approvalStatus: beatmap.approvalStatus, hash: beatmap.hash })
	    //TODO: else (map is already present) : UPDATE MAP => IN CASE THERE'S MAP UPDATE OR SUM ON THE BEATMAP
	})
	return callback("Map successfully added")
}


/*


if (args[0] == "osu" || args[0] == "mania") {
		db_settings.allDocs({username : message.user.ircUsername}, function (err, res) {
		//(`SELECT * FROM modes WHERE username = "${message.user.ircUsername}"`, function (err, res, fields) {
			if (res.length == 0) {
				db_settings.put({username: message.user.ircUsername, mode: args[0]}).then((res) => {
					//connection.query(`INSERT INTO modes (username, mode) VALUES ("${message.user.ircUsername}", "${args[0]}")`, function (err, res, fields) {
					message.user.sendMessage('Your default game mode is now set to: ' + args[0])
				})
			} else {
				db_settings.get({username: message.user.ircUsername}).then((doc) => {
					//connection.query(`UPDATE modes SET mode = "${args[0]}" WHERE username = "${message.user.ircUsername}"`, function (err, res, fields) {
					doc.mode = args[0]
					message.user.sendMessage('Your default game mode is now set to: ' + args[0])
					return db.put(doc)
				})


			}
		})
	} else {
		message.user.sendMessage('Please specify a correct mode. (osu, mania)')
	}

*/

const { APIKEY } = require('../config.json')
const osu = require('node-osu');
var osuApi = new osu.Api(APIKEY, { notFoundAsError: false, completeScores: true })

async function getBeatmaps(beatmapSetId, mode) {
	return await osuApi.getBeatmaps({ s: beatmapSetId, m: modesToAPI[mode] }).then((beatmaps) => { return beatmaps })
}
module.exports.getBeatmaps = getBeatmaps;

function mapLength(nombre) {
    var heures = Math.floor(nombre / 60 / 60)
    var minutes = Math.floor(nombre / 60) - (heures * 60)
    var secondes = nombre % 60
    var duree = minutes.toString().padStart(2, '0') + ':' + secondes.toString().padStart(2, '0')
    return duree
}
module.exports.mapLength = mapLength

function mapRating(nombre) {
    starRating = nombre * 100
    starRating = Math.round(starRating)
    starRating = starRating / 100
    return starRating
}
module.exports.mapRating = mapRating

function getCriterias(args) {

	var criterias = [];
	args.forEach(arg => { if(typeof arg === 'string') arg = arg.toLowerCase(); if(labels.hasOwnProperty(arg)) criterias.push(Array.from(arg)); })
	if(criterias.length < 1) criterias.push("osu") //TODO : Retrieve player option -> Default player mode prefference

	criterias.forEach(mode => {
		args.forEach(arg => { console.log(`${criterias[mode]}.push(${arg});`); if(typeof arg === 'string') arg = arg.toLowerCase(); if(labels[mode] != null && labels[mode].includes(arg)) criterias[mode].push(arg); })
	})

	return criterias;
}
module.exports.getCriterias = getCriterias