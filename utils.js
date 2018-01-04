const chalk = new require('chalk').constructor({level: 3})

const colorCache = []
const bgColorCache = []

function colorFromRgb(r, g, b) {
	const hex = `${r}-${g}-${b}`

	if (typeof colorCache[hex] === 'undefined') {
		const colorCode = chalk.rgb(r, g, b)('▄')
		colorCache[hex] = colorCode
		return colorCode
	}
	return colorCache[hex]
}

function bgColorFromRgb(r, g, b) {
	const hex = `${r}-${g}-${b}`

	if (typeof bgColorCache[hex] === 'undefined') {
		const colorCode = chalk
			.bgRgb(r, g, b)('_')
			.split('_')[0]
		bgColorCache[hex] = colorCode
		return colorCode
	}
	return bgColorCache[hex]
}

module.exports = {colorFromRgb, bgColorFromRgb}
