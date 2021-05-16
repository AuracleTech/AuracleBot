var PouchDB = require('pouchdb-node')
var db_maps = new PouchDB('DB_Maps')
var db_settings = new PouchDB('DB_Settings')
const genres = require("../genres.json")
const getBeatmaps = require('./details.js').getBeatmaps

module.exports.randomMap = async function randomMap(args, mode, callback) {
	db_maps.allDocs({mode : mode}, function (err, res) {
		if (!args || args.length == 0) {
			let random = res.rows[Math.floor(Math.random() * res.rows.length)].main_diff
			db_maps.allDocs({id : random}, function (err, diff) {
				if (err)
					callback(err, null)
				else
					callback(null, diff.rows[0])
			})
		} else {
			db_maps.allDocs({mode : mode}, function (err, diffs) {
				let maps = diffs.rows;
				args.forEach((criteria) => {
					if (isNaN(criteria)) {
						if (genres.osu.includes(criteria) || genres.mania.includes(criteria)) {
							if (genres[mode].includes(criteria))
								maps = maps.filter((map) => map.doc.genre == criteria)
						} else {
							let allM = res.rows
							allM = Object.values(allM).filter((map) =>
								map.doc.artist.toLowerCase().includes(criteria.toLowerCase()) ||
								map.doc.title.toLowerCase().includes(criteria.toLowerCase())
							)
							let newMaps = []
							diffs = [];
							allM.forEach((e) => {
								diffs.push(e.main_diff)
							})
							maps.forEach((m) => {
								if (diffs.includes(m.id))
									newMaps.push(m)
							})
							maps = newMaps
						}
					} else {
						if (criteria < 10 && criteria > 0)
							maps = maps.filter((map) => Math.floor(map.doc.rating) == criteria);
						else
							maps = maps.filter((map) => Math.ceil(map.doc.bpm / 10) * 10 == criteria);
					}
				})
				let randomDiff = null
				if (maps.doc.length != 0)
					randomDiff = maps[Math.floor(Math.random() * maps.doc.length)]
				if (err)
					callback(err, null)
				else
					callback(null, randomDiff)
			})
		}
	})
}

module.exports.bombRandomMap = async function bombRandomMap(args, mode, callback) {
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
							genres.osu.includes(criteria) ||
							genres.mania.includes(criteria)
						) {
							if (mode == "osu") {
								if (genres.osu.includes(criteria)) {
									maps = maps.filter((map) => map.genre == criteria);
								}
							}
							if (mode == "mania") {
								if (genres.mania.includes(criteria)) {
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
										map.mode == mode) ||
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

module.exports.defaultMode = async function getDefaultMode(username, callback) {
	await db_settings.allDocs({username : username}, function (err, res) {
		if (res.rows.length > 0)
			callback(res.rows[0].mode);
		else
			callback("osu");
	})
}

module.exports.addMap = async function addMap(args, callback) {
	if(!args || args.length != 3) return callback("You need 3 arguments : Mode Genre beatmapSetID")
	var mode = args[0].toLowerCase(), genre = args[1].toLowerCase(), beatmapSetId = args[2]
	if(!genres.hasOwnProperty(mode)) return callback("Invalid mode. Valid modes are : " + Object.keys(genres).join(' '))
	if(!genres[mode].includes(genre)) return callback("Invalid genre. Valid genres are : " + genres[mode].join(' '))

	if(isNaN(beatmapSetId)) return callback("The map ID must be a number")
	var beatmaps = await getBeatmaps(beatmapSetId).then((beatmaps) => { if(beatmaps.length < 1) return callback("Invalid beatmap set ID : No maps found"); else return beatmaps })

	beatmaps.forEach(async function(beatmap) { //TODO: CHECK IF EACH BEATMAPS HAS THE MENTIONNED MODE/GENRES TYPE => IF NOT ADD THE MODES OR GENRES
    	await db_maps.get(beatmap.id).then(function(doc) {
			//TODO: UPDATE SYSTEM IN CASE THERE'S NEWS OR SOMETHING ON THE BEATMAP
		}).catch(async function(err) {
	    	await db_maps.put({ beatmapSetId: beatmap.beatmapSetId, mode: mode, genre: genre, _id: beatmap.id, artist: beatmap.artist, title: beatmap.title,
	    		rating: beatmap.difficulty.rating, bpm: beatmap.bpm, length: beatmap.length.total, version: beatmap.version, approvalStatus: beatmap.approvalStatus, hash: beatmap.hash })
	    		.catch((err) => { console.log("Error Brain.AddMap:" + err); })
		})
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