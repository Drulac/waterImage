const fs = require('fs'),
	util = require('util'),
	PNG = require('pngjs').PNG,
	gm = require('gm'),
	chalk = require('chalk')

const readFile = util.promisify(fs.readFile);

const colorCache = []
function colorFromRgb(r, g, b) {
	const hex = `${r}-${g}-${b}`

	if (colorCache[hex] ===  void 0) {
		colorCache[hex] = chalk.rgb(r, g, b)('▄')
	}

	return colorCache[hex]
}

const bgColorCache = []
function bgColorFromRgb(r, g, b) {
	const hex = `${r}-${g}-${b}`

	if (bgColorCache[hex] === void 0) {
		bgColorCache[hex] = chalk
			.bgRgb(r, g, b)('_')
			.split('_')[0]
	}

	return bgColorCache[hex]
}

async function gmToBuffer(gmObj) {
	return new Promise((resolve, reject) => {
		gmObj.toBuffer('PNG', (err, buffer) => {
			if (err) return reject(err)

			return resolve(buffer)
		})
	});
}

async function onParserPNG(pngObj) {
	return new Promise((resolve, reject) => {
		pngObj.on('parsed', function () {
			resolve(this)
		})
	})
}

module.exports = async function transform({filename, width, height, depth}) {
	const file = await readFile(filename)

	const gmObj = gm(file, filename)
		.resize(width, height)
		.bitdepth(depth)

	const buffer = await gmToBuffer(gmObj)
	const pngObj = await onParserPNG(new PNG({colorType: 2}).parse(buffer))

	const lineWidth = pngObj.width * 4
	const lines = []
	for (let y = 0; y < pngObj.height - 1; y += 2) {
		const c = pngObj.data.slice(lineWidth * y, lineWidth * (y + 2))

		const line = c.slice(0, lineWidth)
		const nextLine = c.slice(lineWidth, lineWidth * 2)

		let lineContent = ''
		for (let idx = 0; idx < lineWidth; idx += 4) {
			const color = colorFromRgb(nextLine[idx], nextLine[idx + 1], nextLine[idx + 2])
			lineContent += bgColorFromRgb(line[idx], line[idx + 1], line[idx + 2]) + color
		}

		lines.push(lineContent)
	}

	return lines.join(chalk.reset('\n')) + chalk.reset(' ').split(' ')[0]
}
