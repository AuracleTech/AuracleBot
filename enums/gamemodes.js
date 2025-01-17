exports.gamemodes = {
    'osu': ['alternate', 'tech', 'classic', 'jump', 'stream', 'flick', 'cursordance', 'experimental', 'puzzle', 'balanced', 'marathon', 'tag', 'art', 'pp', 'relax', 'spaced-stream', 'deathstream', 'hyper-deathstream', 'ninja', 'complex', 'burst'],
    'ctb': ['jump', 'stream', 'marathon'],
    'taiko': ['futsu', 'muzukashii', 'oni', 'marathon'],
    'mania': ['classic', 'stream', 'jacks', 'ln', 'sv', 'tech', 'marathon'],
}

exports.binaries = { 'osu': 0, 'taiko': 1, 'ctb': 2, 'mania': 3 }

exports.getBinary = gamemode => {
    for (const key of Object.keys(this.binaries)) if (key == gamemode) return this.binaries[key]
    return
}

exports.isGenre = (genre, gamemode) => {
    for (const [key, values] of Object.entries(this.gamemodes)) if (key == gamemode && values.includes(genre)) return true
    return false
}

exports.isGamemode = gamemode => {
    return (this.gamemodes.hasOwnProperty(gamemode.toLowerCase()))
}