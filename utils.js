/**
* Log the msg to console with an alert category
* @param {Number} msg : the messaged desired to log
* @param {Number} category : from 0 to 4, for Log, Debug, Warning, CRITICAL and Laboratory respectively
*/
function log (msg, category = 0) {
	let prefix = { 0: '\x1b[32mLog ›', 1: '\x1b[36mDebug ›', 2: '\x1b[33mWarning ›', 3: '\x1b[31mCRITICAL ›', 4: '\x1b[95mLaboratory ›' }
	console.log(`${getFormattedDate()} ${prefix[category]}\x1b[0m ${msg}`)
}

// Returns the current date format yyyy-month-dd hh-mm
function getFormattedDate () {
	let today = new Date()
	let yyyy = today.getFullYear()
    let month = String(today.getMonth() + 1).padStart(2, '0')
    let dd = String(today.getDate()).padStart(2, '0')
    let hh = today.getHours()
    let mm = String(today.getMinutes()).padStart(2, '0')
    return `${yyyy}-${month}-${dd} ${hh}:${mm}`
}

// Returns a time format from seconds mm:ss
// TODO : Add a checkup for hours and more in case a map is unresonnably long
function formatTimeFromSecs(secs){
    let hh = Math.floor(secs / 60 / 60)
    let mm = Math.floor(secs / 60) - (hh * 60)
    let ss = secs % 60
    if (hh > 0) return `${hh}h${mm}m${String(ss).padStart(2, '0')}`
    return `${mm}m${String(ss).padStart(2, '0')}`
}

module.exports.log = log 
module.exports.getFormattedDate = getFormattedDate
module.exports.formatTimeFromSecs = formatTimeFromSecs