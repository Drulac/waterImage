#! /usr/bin/env node
const transform = require('../index')

function handleError(e) {
	console.error(e);

	return e;
}

const [,,filename, depth = 4] = process.argv
const height = process.stdout.rows * 2,
    width = process.stdout.columns

transform({filename, width, height, depth})
    .then(asciiBuffer => console.log(asciiBuffer))
    .catch(handleError)