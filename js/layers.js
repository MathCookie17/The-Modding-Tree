// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
    gain = gain.times(layers.plus.effect())
	return gain
}

function getPlusSoftcap() {
let plussoftcap = new Decimal(10)
if (hasUpgrade("plus", 12)) plussoftcap = plussoftcap.mul(2)
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
            let plusButtonMessage = "Line up your points for <b>+" + layers.plus.getResetGain() + "</b> pluses"
            let nextAt = "<br>Next at <b>" + formatWhole(layers.plus.getNextAt()) + "</b> points"
            if (hasUpgrade("plus", 21)) plusButtonMessage = plusButtonMessage + nextAt
            return plusButtonMessage
        }
        else {return "You need at least <b>9</b> points to line them up!"}
    },
    effect() {
        let pluseffect = new Decimal(0)
        if (player["plus"].points.lt(getPlusSoftcap())) {pluseffect = player["plus"].points.add(1)}
        else {pluseffect = getPlusSoftcap().add(player["plus"].points.subtract(getPlusSoftcap()).add(1).root(2))}
        return pluseffect
    },
    effectDescription() {return "which multiply point gain by " + format(layers.plus.effect().times(100).round().div(100)) + ". The current plus softcap is " + format(getPlusSoftcap()) + "."},
    row: 0, // Row the layer is in on the tree (0 is the first row)
    upgrades: {
        rows: 3,
        cols: 2,
        11: {
            title: "Plus One",
            description: "Gain one extra plus on reset",
            cost: new Decimal(18),
        },
        12: {
            title: "Second Bottlecap",
            description: "Double the plus softcap",
            cost: new Decimal(90),
            unlocked() {return hasUpgrade("plus", 11)}
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
            unlocked() {return hasUpgrade("plus", 21)}
        },
    },
    hotkeys: [
        {key: "p", description: "Reset for pluses", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})