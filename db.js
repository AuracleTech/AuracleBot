// Importing Modules
const log = require('./utils').log

/**
* Upsert informations in a database using the given ID and the data
* @param {PouchDB} db : the database to use
* @param {Number} id : the unique id of the document
* @param {Object} data : data key/value pairs to be upserted
*/
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

/**
* Retrieve specific values of a document in a database using the given ID
* @param {PouchDB} db : the database to use
* @param {Number} id : the unique id of the document
* @param {Array} args : array of keys to retrieve values from
*/
module.exports.get = async (db, id, args = []) => {
    return new Promise(resolve => {
        let data = {}
        db.get(id, (err, doc) => {
            if (err)
                return resolve(null)
            else
                if (args.length <= 0)
                    data = doc
                else
                    for (const arg of args)
                    data[arg] = doc[arg]
            return resolve(data)
        })
    })
}