// Importing Modules
const db = require('./db')
const index = require('./index')

exports.getTopScores = async (username) => {
    return await db.upsert(index.db_settings, username, { lastScoreGrabDate: new Date() })
}

exports.isOnCooldown = async (username) => {
    let data = await db.get(index.db_settings, username, [ 'lastScoreGrabDate' ])
    if (!data) return false
    let daysPassed = parseInt((new Date() - Date.parse(data.lastScoreGrabDate)) / (1000 * 60 * 60 * 24))
    return daysPassed < index.minimumCooldownTopScores
}