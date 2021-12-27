// Importing Modules
const { Console } = require('console')
const fs = require('fs')
var moment = require('moment')

// Variables
if (!fs.existsSync(process.env.FOLDER_LOGS)) fs.mkdirSync(process.env.FOLDER_LOGS)
var logger = fs.createWriteStream(`${process.env.FOLDER_LOGS}${moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.log`, { flags : 'w' });

/**
* Log the msg to console with an alert level
* @param {Number} msg : the messaged desired to log
* @param {Number} level : warning level from 0 to 5, for Log, Debug, Warning, CRITICAL, Laboratory and Input respectively
*/
module.exports.log = (msg, level = 0) => {
	let colors = { 0: '\x1b[32m', 1: '\x1b[36m', 2: '\x1b[33m', 3: '\x1b[31m', 4: '\x1b[95m', 5: '\x1b[95m', '-1': '\x1b[0m' }
	let prefix = { 0: 'Log', 1: 'Debug', 2: 'Warning', 3: 'CRITICAL', 4: 'Laboratory', 5: 'Input' }
    let date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    console.log(`${date} ${colors[level]}${prefix[level]} >${colors[-1]} ${msg}`)
    logger.write(`${date} ${prefix[level]} > ${msg}\n`)
}

// Returns a time format from seconds mm:ss
module.exports.formatTimeFromSecs = secs => {
    let hh = Math.floor(secs / 60 / 60)
    let mm = Math.floor(secs / 60) - (hh * 60)
    let ss = secs % 60
    if (hh > 0) return `${hh}h${mm}m${String(ss).padStart(2, '0')}`
    return `${mm}m${String(ss).padStart(2, '0')}`
}