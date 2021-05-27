const gamemodes = {
    "osu": ["alternate", "tech", "classic", "jump", "reading", "stream", "elite", "experimental", "puzzle", "balanced", "marathon", "tag", "art", "pp", "relax"],
    "ctb": ["jump", "stream", "marathon"],
    "taiko": ["futsu", "muzukashii", "oni", "marathon"],
    "mania": ["classic", "stream", "jacks", "ln", "sv", "tech", "marathon"],
}

const binaries = { "osu": 0, "taiko": 1, "ctb": 2, "mania": 3 }

function getBinary(gamemode){
    for (const [key, values] of Object.entries(binaries)) if (key == gamemode) return binaries[key]
    return
}

function isGenre(genre, gamemode){
    for (const [key, values] of Object.entries(gamemodes)) if (key == gamemode && values.includes(genre)) return true
    return false
}

function isGamemode(gamemode){
    if (gamemodes.hasOwnProperty(gamemode.toLowerCase())) return true
    else return false
}

exports.gamemodes = gamemodes
exports.binaries = binaries
exports.getBinary = getBinary
exports.isGenre = isGenre
exports.isGamemode = isGamemode