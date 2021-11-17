exports.binaries = {
    0:           ['None', 'NM'],
    1:           ['NoFail', 'NF'],
    2:           ['Easy', 'EZ'],
    4:           ['TouchDevice', 'TD'],
    8:           ['Hidden', 'HD'],
    16:          ['HardRock', 'HR'],
    32:          ['SuddenDeath', 'SD'],
    64:          ['DoubleTime', 'DT'],
    128:         ['Relax', 'RX'],
    256:         ['HalfTime', 'HT'],
    512:         ['Nightcore', 'NC'], // Only set along with DoubleTime. i.e: NC only gives 576
    1024:        ['Flashlight', 'FL'],
    2048:        ['Autoplay', 'AP'],
    4096:        ['SpunOut', 'SO'],
    8192:        ['Relax2', 'AP'], // Autopilot
    16384:       ['Perfect', 'PF'], // Only set along with SuddenDeath. i.e: PF only gives 16416  
    32768:       ['Key4', '4K'],
    65536:       ['Key5', '5K'],
    131072:      ['Key6', '6K'],
    262144:      ['Key7', '7K'],
    524288:      ['Key8', '8K'],
    1048576:     ['FadeIn', 'FI'],
    2097152:     ['Random', 'RD'],
    4194304:     ['Cinema', 'CM'],
    8388608:     ['Target', 'TP'],
    16777216:    ['Key9', '9K'],
    33554432:    ['KeyCoop', ''],
    67108864:    ['Key1', '1K'],
    134217728:   ['Key3', '3K'],
    268435456:   ['Key2', '2K'],
    536870912:   ['ScoreV2', 'SV2'],
    1073741824 : ['Mirror', 'MR'],
}

exports.groups = {
    'KeyMod' : [ 'Key1', 'Key2', 'Key3', 'Key4', 'Key5', 'Key6', 'Key7', 'Key8', 'Key9', 'KeyCoop' ], // TODO : To convert to binaries, also verify the mods
    'FreeModAllowed' : [ 'NoFail', 'Easy', 'Hidden', 'HardRock', 'SuddenDeath', 'Flashlight', 'FadeIn', 'Relax', 'Relax2', 'SpunOut', 'KeyMod' ], // TODO : To convert to binaries, also verify the mods
    'AffectStarRating' : [ 2, 16, 64, 256, 512 ], // Verify mods and check for other mods than std
    'AffectScore' : [ 8, 16, 1, 2, 256, 64, 512, 1024, 1048576 ], // Verify mods and check for other mods than std
}

exports.getBinary = (mod) => {
    for (const [key, values] of Object.entries(binaries))
        for (let arg of values) if (arg.trim().toLowerCase() == mod.trim().toLowerCase()) return key
    return
}

exports.getFullname = (mod) => {
    for (const [key, values] of Object.entries(binaries))
         for (let arg of values)
           if (key == mod || arg.trim().toLowerCase().includes(mod.trim().toLowerCase())) return values[0]
    return
}

exports.getAbbreviation = (mod) => {
    for (const [key, values] of Object.entries(binaries))
        for (let arg of values)
            if (key == mod || arg.trim().toLowerCase().includes(mod.trim().toLowerCase())) return values[1]
    return
}

exports.hasDoubleTime = (mods) => {
    for (let mod of mods) if (mod == 64 || mod == 512) return true
    return false
}

exports.hasHalfTime = (mods) => {
    for (let mod of mods) if (mod == 256) return true
    return false
}

exports.doesAffectStarRating = (mod) => {
    if (groups.AffectStarRating.includes(mod)) return true
    return false
}

exports.rawToArray = (raw_mods) => {
    let mods = []
    let sortedBinaries = Object.keys(binaries)
    sortedBinaries.sort(function(a, b){return b - a})
    sortedBinaries.pop()
    for (let binaryMod of sortedBinaries) if (raw_mods >= binaryMod) { mods.push(parseInt(binaryMod)); raw_mods = raw_mods - binaryMod; }
    return mods
}