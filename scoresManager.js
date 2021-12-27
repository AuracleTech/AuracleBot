// Importing Modules
const node_osu = require('node-osu')
let api_osu = new node_osu.Api(process.env.API_KEY, { notFoundAsError: false, completeScores: true })
const db = require('./db')
const index = require('./index')

exports.getTopScores = async (user) => {
    db.upsert(index.db_settings, user.id, { lastScoreGrabDate: new Date() })
    api_osu.getUserBest({ u: user.id, type: "id" }).then(async scores => {
        for (let score of scores) await db.upsert(index.db_scores, `${score.user.id}${score.beatmapId}`, { score })
    })
}

exports.isOnCooldown = async (user) => {
    let data = await db.get(index.db_settings, user.id, [ 'lastScoreGrabDate' ])
    if (!data) return false
    let daysPassed = parseInt((new Date() - Date.parse(data.lastScoreGrabDate)) / (1000 * 60 * 60 * 24))
    return daysPassed < index.minimumCooldownTopScores
}