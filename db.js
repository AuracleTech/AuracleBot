// Importing Modules
const log = require('./utils').log

module.exports.upsert = async (db, id, data) => {
    return new Promise((resolve, reject) => {
        let doc = db.upsert(id, function (doc) {
            for (const [key, values] of Object.entries(data))
                doc[key] = values
            return doc
        }).catch(err => reject(err))
        return resolve(doc)
    })
}

module.exports.get = async (db, id, args) => {
    return new Promise((resolve, reject) => {
        let data = {}
        db.get(id, (err, doc) => {
            if (err)
                return resolve(null)
            else
                for (const arg of args)
                data[arg] = doc[arg]
            return resolve(data)
        })
    })
}