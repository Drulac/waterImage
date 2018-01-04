const filename = process.argv[2],
	depth = process.argv[3] || 4

const fs = require('fs'),
	PNG = require('pngjs').PNG,
	gm = require('gm'),
	chalk = require('chalk')

const height = process.stdout.rows * 2,
	width = process.stdout.columns

let colorCache = []

function colorFromRgb(r, g, b) {
	const hex = `${r}-${g}-${b}`

	if (colorCache[hex] !== undefined) {
		return colorCache[hex]
	} else {
		const colorCode = chalk.rgb(r, g, b)('▄')

		colorCache[hex] = colorCode

		return colorCode
	}
}

let bgColorCache = []

function bgColorFromRgb(r, g, b) {
	const hex = `${r}-${g}-${b}`

	if (bgColorCache[hex] !== undefined) {
		return bgColorCache[hex]
	} else {
		const colorCode = chalk
			.bgRgb(r, g, b)('_')
			.split('_')[0]

		bgColorCache[hex] = colorCode

		return colorCode
	}
}

//console.time('render')
gm(fs.readFileSync(filename), filename)
	.resize(width, height)
	.bitdepth(depth)
	.toBuffer('PNG', function(err, buffer) {
		if (err) return handle(err)

		new PNG({colorType: 2}).parse(buffer).on('parsed', async function() {
			//console.time('transform')

			const lineWidth = this.width * 4

			let promesses = []

			for (let y = 0; y < this.height - 1; y += 2) {
				promesses.push(
					new Promise((resolve, reject) => {
						const c = this.data.slice(lineWidth * y, lineWidth * (y + 2))

						const line = c.slice(0, lineWidth)
						const nextLine = c.slice(lineWidth, lineWidth * 2)

						let lineContent = ''
						for (let idx = 0; idx < lineWidth; idx += 4) {
							const color = colorFromRgb(nextLine[idx], nextLine[idx + 1], nextLine[idx + 2])
							lineContent += bgColorFromRgb(line[idx], line[idx + 1], line[idx + 2]) + color
						}

						resolve(lineContent)
					})
				)
			}

			console.log((await Promise.all(promesses)).join(chalk.reset('\n')) + chalk.reset(' ').split(' ')[0])

			//console.timeEnd('transform')
			//console.timeEnd('render')
		})
	})
