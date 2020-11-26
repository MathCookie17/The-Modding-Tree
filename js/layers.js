// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
    gain = gain.times(layers.plus.effect())
    if (hasUpgrade("plus", 13)) gain = gain.times(upgradeEffect("plus", 13))
    if (hasUpgrade("plus", 33)) gain = gain.times(upgradeEffect("plus", 33))
	return gain
}

function getPlusSoftcap(ust) {
let plussoftcap = new Decimal(10)
if (hasUpgrade("plus", 12)) plussoftcap = plussoftcap.mul(new Decimal(2).pow(ust))
if (hasUpgrade("plus", 32)) plussoftcap = plussoftcap.mul(upgradeEffect("plus", 32).pow(ust))
if (hasUpgrade("plus", 34)) plussoftcap = plussoftcap.mul(upgradeEffect("plus", 34).pow(ust))
return plussoftcap
}

addLayer("plus", {
    name: "pluses", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "+", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#0BE394",
    requires: new Decimal(9), // Can be a function that takes requirement increases into account
    resource: "pluses", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "custom",
    getResetGain() {
        let plusgain = new Decimal(0)
        if (player.points.gte(9)) plusgain = plusgain.add(1)
        if (hasUpgrade("plus", 21)) plusgain = player.points.div(9).root(2)
        if (hasUpgrade("plus", 31)) plusgain = plusgain.times(upgradeEffect("plus", 31))
        if (hasUpgrade("plus", 11)) plusgain = plusgain.add(1)
        return plusgain.floor()
    },
    getNextAt() {
        let nextAt = new Decimal(layers.plus.getResetGain().add(1))
        if (hasUpgrade("plus", 11)) nextAt = nextAt.sub(1)
        if (hasUpgrade("plus", 31)) nextAt = nextAt.div(upgradeEffect("plus", 31))
        return nextAt.pow(2).mul(9)
    },
    canReset() {return player.points.gte(9)},
    prestigeButtonText() {
        if (player.points.gte(9)) {
            let plusButtonMessage = "Line up your points for <b>+" + formatWhole(layers.plus.getResetGain()) + "</b> pluses"
            let nextAt = "<br>Next at <b>" + formatWhole(layers.plus.getNextAt()) + "</b> points"
            if (hasUpgrade("plus", 21)) plusButtonMessage = plusButtonMessage + nextAt
            return plusButtonMessage
        }
        else {return "You need at least <b>9</b> points to line them up!"}
    },
    effect() {
        let pluseffect = new Decimal(0)
        if (player["plus"].points.lt(getPlusSoftcap(1))) {pluseffect = player["plus"].points.add(1)}
        else {pluseffect = getPlusSoftcap(1).add(player["plus"].points.subtract(getPlusSoftcap(1)).add(1).root(2))}
        return pluseffect
    },
    effectDescription() {return "which multiply point gain by " + format(layers.plus.effect().times(100).round().div(100)) + ". The current plus softcap is " + format(getPlusSoftcap(1)) + "."},
    row: 0, // Row the layer is in on the tree (0 is the first row)
    upgrades: {
        rows: 3,
        cols: 5,
        11: {
            title: "Plus One",
            description: "Gain one extra plus on reset",
            cost: new Decimal(18),
        },
        12: {
            title: "Slight Lifting",
            description: "Double the plus softcap",
            cost: new Decimal(90),
            unlocked() {return hasUpgrade("plus", 21)}
        },
        13: {
            title: "Add Again",
            description: "The plus multiplier is applied a second time, but without plus softcap increase upgrades",
            cost: new Decimal(460),
            effect() {
                let capst = new Decimal(0)
                if (hasUpgrade("plus", 14)) capst = new Decimal(0.5)
                if (hasUpgrade("plus", 15)) capst = new Decimal(1)
                let pluseffect = new Decimal(0)
                if (player["plus"].points.lt(getPlusSoftcap(capst))) {pluseffect = player["plus"].points.add(1)}
                else {pluseffect = getPlusSoftcap(capst).add(player["plus"].points.subtract(getPlusSoftcap(capst)).add(1).root(2))}
                return pluseffect
            },
            effectDisplay() {return "x" + format(upgradeEffect("plus", 13))},
            unlocked() {return hasUpgrade("plus", 12)},
        },
        14: {
            title: "Secondary Lifting",
            description: "Plus softcap increase upgrades have their square roots applied to Add Again",
            cost: new Decimal(6260),
            unlocked() {return hasUpgrade("plus", 13)}
        },
        15: {
            title: "Two On The Ceiling",
            description: "Plus softcap increase upgrades fully apply to Add Again",
            cost: new Decimal(89400),
            unlocked() {return hasUpgrade("plus", 14)}
        },
        21: {
            title: "Multiple Lineups",
            description: "You can gain multiple pluses on reset",
            cost: new Decimal(34),
            unlocked() {return hasUpgrade("plus", 11)},
        },
        31: {
            title: "Plus Overlap",
            description: "You gain more pluses based on points",
            cost: new Decimal(58),
            effect() {return player.points.add(1).log(9).add(1)},
            effectDisplay() {return "x" + format(upgradeEffect("plus", 31))},
            unlocked() {return hasUpgrade("plus", 21)},
        },
        32: {
            title: "Weight of the Points",
            description: "The plus softcap is increased based on points",
            cost: new Decimal(140),
            effect() {return player.points.add(1).log(9).add(1)},
            effectDisplay() {return "x" + format(upgradeEffect("plus", 32))},
            unlocked() {return hasUpgrade("plus", 31)},
        },
        33: {
            title: "Plus Decomposition",
            description: "You gain more points based on pluses",
            cost: new Decimal(9820),
            effect() {return player["plus"].points.add(1).log(9).add(1)},
            effectDisplay() {return "x" + format(upgradeEffect("plus", 33))},
            unlocked() {return hasUpgrade("plus", 32)},
        },
        34: {
            title: "Towering Pluses",
            description: "The plus softcap is increased based on pluses",
            cost: new Decimal(22222),
            effect() {return player["plus"].points.add(1).log(9).add(1)},
            effectDisplay() {return "x" + format(upgradeEffect("plus", 34))},
            unlocked() {return hasUpgrade("plus", 33)},
        },
    },
    hotkeys: [
        {key: "p", description: "Reset for pluses", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})