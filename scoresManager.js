async function getTopScores (username) {
    return
    /*
    if (!onTopPlaysCooldown(username)) getTopScores(username) ->

    const { APIKEY } = require('./config.json')
    const osu = require('node-osu')
    let osuApi = new osu.Api(APIKEY, { notFoundAsError: false, completeScores: true })

    let gamemode = 'osu'

    const getBeatmaps = require('./functions/brain.js').getBeatmaps
    const mapRating = require('./functions/brain.js').mapRating
    const osu_mods = require('./enums/mods.js')

    await osuApi.getUserBest({ u: username }).then(async topscores => {
        
        for (let score of topscores) {
            scores.register(score)
            beatmaps.register(score._beatmap)
        }
    })*/
}

exports.getTopScores = getTopScores