let PouchDB = require('pouchdb-node')
PouchDB.plugin(require('pouchdb-upsert'))
let db_scores = new PouchDB('DB/DB_Scores')
let db_beatmaps = new PouchDB('DB/DB_Beatmaps')
let db_settings = new PouchDB('DB/DB_Settings')

