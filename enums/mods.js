const binaries = {
    0:           ["None", ""],
    1:           ["NoFail", "NF"],
    2:           ["Easy", "EZ"],
    4:           ["TouchDevice", "TD"],
    8:           ["Hidden", "HD"],
    16:          ["HardRock", "HR"],
    32:          ["SuddenDeath", "SD"],
    64:          ["DoubleTime", "DT"],
    128:         ["Relax", "RX"],
    256:         ["HalfTime", "HT"],
    512:         ["Nightcore", "NC"], // Only set along with DoubleTime. i.e: NC only gives 576
    1024:        ["Flashlight", "FL"],
    2048:        ["Autoplay", "AP"],
    4096:        ["SpunOut", "SO"],
    8192:        ["Relax2", "AP"], // Autopilot
    16384:       ["Perfect", "PF"], // Only set along with SuddenDeath. i.e: PF only gives 16416  
    32768:       ["Key4", "4K"],
    65536:       ["Key5", "5K"],
    131072:      ["Key6", "6K"],
    262144:      ["Key7", "7K"],
    524288:      ["Key8", "8K"],
    1048576:     ["FadeIn", "FI"],
    2097152:     ["Random", "RD"],
    4194304:     ["Cinema", "CM"],
    8388608:     ["Target", "TP"],
    16777216:    ["Key9", "9K"],
    33554432:    ["KeyCoop", ""],
    67108864:    ["Key1", "1K"],
    134217728:   ["Key3", "3K"],
    268435456:   ["Key2", "2K"],
    536870912:   ["ScoreV2", "SV2"],
    1073741824 : ["Mirror", "MR"],
}

const groups = {
    "KeyMod" : [ "Key1", "Key2", "Key3", "Key4", "Key5", "Key6", "Key7", "Key8", "Key9", "KeyCoop" ], // TODO : To convert to binaries
    "FreeModAllowed" : [ "NoFail", "Easy", "Hidden", "HardRock", "SuddenDeath", "Flashlight", "FadeIn", "Relax", "Relax2", "SpunOut", "KeyMod" ], // TODO : To convert to binaries
    "ScoreIncreaseMods" : [ "Hidden", "HardRock", "DoubleTime", "NightCore", "Flashlight", "FadeIn" ], // TODO : To convert to binaries
    "AffectScore" : [ 8, 16, 1, 2, 256, 64, 512, 1024, 1048576 ],
}

function getBinary(mod){
    for (const [key, values] of Object.entries(binaries))
        for (let arg of values) if (arg.toLowerCase() == mod.toLowerCase()) return key
    return
}

function getFullname(mod){
    // TODO : Optimize this a tiny bit
    for (const [key, values] of Object.entries(binaries))
         for (let arg of values)
           if (key == mod || arg.toLowerCase().includes(mod.toLowerCase())) return values[0]
    return
}

function getAbbreviation(mod){
    // TODO : Optimize this a tiny bit
    for (const [key, values] of Object.entries(binaries))
        for (let arg of values)
            if (key == mod || arg.toLowerCase().includes(mod.toLowerCase())) return values[1]
    return
}

function hasDoubleTime(mods){
    for (let mod of mods) if (mod == 64 || mod == 512) return true
    return false
}

function hasHalfTime(mods){
    for (let mod of mods) if (mod == 256) return true
    return false
}

exports.binaries = binaries
exports.groups = groups
exports.getBinary = getBinary;
exports.getFullname = getFullname;
exports.getAbbreviation = getAbbreviation;
exports.hasDoubleTime = hasDoubleTime;
exports.hasHalfTime = hasHalfTime;