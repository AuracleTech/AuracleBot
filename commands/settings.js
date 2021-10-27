// TODO : Command
module.exports.help = { name: 'settings', alias: 's' }
module.exports.run = async (message, args, callback) => { /*	setSettings(message.user.ircUsername, args, function (msg) { callback(msg) }) */ }



/*
module.exports.setSettings = setSettings
async function setSettings(name, args, callback){
	// TODO : Add more default settings
	switch(args[0]) {
		case 'gamemode':
			var argGamemodes = await detectGamemodes(args[1].split())
			if(Object.keys(argGamemodes).length < 1) { callback('You need at least one mode. Valid modes are : ' + Object.keys(osu_gamemodes.gamemodes).join(' ')); break }
			argGamemodes = Object.keys(argGamemodes)[0]
			db_settings.upsert(name, function (doc) {
				doc.default_gamemode = argGamemodes
				return doc
			})
			return callback(`Default gamemode set to ${argGamemodes}`)
			break
		default:
			return callback(`Bruh what you even talkin about`)
			break
	}
}
*/