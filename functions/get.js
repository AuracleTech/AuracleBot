var PouchDB = require('pouchdb-node')
var db_maps = new PouchDB('DB_Maps')
var db_difficulties = new PouchDB('DB_Difficulties')
var db_modes = new PouchDB('DB_Modes')
const genres = require("../genres.json")

module.exports.randomMap = async function randomMap(args, mode, callback) {
	db_maps.allDocs({mode : mode}, function (err, res) {
		//connection.query(`SELECT * FROM maps WHERE mode = "${mode}"`, function (
		if (!args || args.length == 0) {
			let random = res.rows[Math.floor(Math.random() * res.rows.length)].main_diff;
			db_difficulties.allDocs({id : random}, function (err, diff) {
				//"SELECT * FROM difficulties WHERE id = " + random,
				if (err) callback(err, null)
				else callback(null, diff.rows[0])
			});
		} else {
			db_difficulties.allDocs({mode : mode}, function (err, diffs) {
			//`SELECT * FROM difficulties WHERE mode = "${mode}"`,
console.log('RESULT IS ', res)
				let maps = diffs.rows;
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
									map.artist.toLowerCase().includes(criteria.toLowerCase()) ||
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
				if (maps.length != 0) {
					randomDiff = maps[Math.floor(Math.random() * maps.length)];
				}
				if (err) callback(err, null)
				else callback(null, randomDiff)
			})
		}
	})
}

module.exports.bombRandomMap = async function bombRandomMap(args, mode, callback) {
	db_maps.allDocs({mode : mode}, function (err, res) {
	//`SELECT * FROM maps WHERE mode = "${mode}"`, function (
		if (!args || args.length == 0) {
			db_difficulties.allDocs({}, function (err, res) {
			//connection.query("SELECT * FROM difficulties", function (
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
			db_difficulties.allDocs({mode : mode}, function (err, res) {
			//`SELECT * FROM difficulties WHERE mode = "${mode}"`,
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
	await db_modes.allDocs({username : username}, function (err, res) {
		//`SELECT * FROM modes WHERE username = "${username}"`,
		if (res.total_rows > 0) callback(res.rows[0].mode);
		else callback("osu");
	})
}

module.exports.addMap = async function addMap(args, callback) {
	if (!args || args.length != 2) return callback("You need 3 arguments : Mode Genre mapID")
	if(!genres.includes(args[0])) return callback("Valid modes are : " + genres.join(' '))
	if(!genres[args[0]].includes(args[1])) return callback("Valid genres are : " + genres[args[0]].join(' '))
	if(!isNaN(args[2])) return callback("~OK add " + args[2])
}