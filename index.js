const fs = require('fs'),
	PNG = require('pngjs').PNG,
	gm = require('gm'),
	chalk = new require('chalk').constructor({level: 3}),
	{colorFromRgb, bgColorFromRgb} = require('./utils.js')

module.exports = function(filename, width, height, depth) {
	return new Promise((resolve, reject) => {
		function onParsed() {
			const lineWidth = this.width * 4

			const lines = []

			for (let y = 0; y < this.height - 1; y += 2) {
				const c = this.data.slice(lineWidth * y, lineWidth * (y + 2))

				const line = c.slice(0, lineWidth)
				const nextLine = c.slice(lineWidth, lineWidth * 2)

				let lineContent = ''
				for (let idx = 0; idx < lineWidth; idx += 4) {
					const color = colorFromRgb(nextLine[idx], nextLine[idx + 1], nextLine[idx + 2])
					lineContent += bgColorFromRgb(line[idx], line[idx + 1], line[idx + 2]) + color
				}

				lines.push(lineContent)
			}
			console.log(chalk.reset(lines.join(chalk.reset('\n'))))
		}

		gm(fs.readFileSync(filename), filename)
			.resize(width, height)
			.bitdepth(depth)
			.toBuffer('PNG', function(err, buffer) {
				if (err) return err

				new PNG().parse(buffer).on('parsed', onParsed)
			})
	})
}
