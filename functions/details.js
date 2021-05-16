const { APIKEY } = require('../config.json')
const osu = require('node-osu');
var osuApi = new osu.Api(APIKEY, { notFoundAsError: false, completeScores: true })

module.exports.getBeatmaps = async function getBeatmaps(beatmapSetId) {
	return await osuApi.getBeatmaps({ s: beatmapSetId }).then((beatmaps) => { return beatmaps })
}

module.exports.mapLength = function mapLength(nombre) {
    var heures = Math.floor(nombre / 60 / 60)
    var minutes = Math.floor(nombre / 60) - (heures * 60)
    var secondes = nombre % 60
    var duree = minutes.toString().padStart(2, '0') + ':' + secondes.toString().padStart(2, '0')
    return duree
}

module.exports.mapRating = function mapRating(nombre) {
    starRating = nombre * 100
    starRating = Math.round(starRating)
    starRating = starRating / 100
    return starRating
}

