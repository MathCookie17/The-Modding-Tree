// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	gain = gain.times(layers.plus.effect())
	return gain
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
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "pluses", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    effect() {
        let pointsoftcap = new Decimal(10)
        let pluseffect = 0
        if (player["plus"].points.lt(pointsoftcap)) {pluseffect = player["plus"].points.add(1)}
        else {pluseffect = pointsoftcap.add(player["plus"].points.subtract(pointsoftcap).add(1).root(2))}
        return pluseffect
    },
    effectDescription() {return "which multiply point gain by " + layers.plus.effect().times(100).round().div(100)
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})
