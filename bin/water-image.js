const [, , filename, depth = 4] = process.argv
const height = process.stdout.rows * 2,
	width = process.stdout.columns

const transform = require('../index')

transform(filename, width, height, depth)
	.then(console.log)
	.catch(console.error)
