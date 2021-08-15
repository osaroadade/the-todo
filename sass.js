const sass = require("sass")
const {promisify} = require("util")
const sassRenderPromise = promisify(sass.render)
const {writeFile} = require("fs");
const writeFilePromise = promisify(writeFile);

async function main() {
	const styleResult = await sassRenderPromise({
		file: `sass/style.sass`,
		outFile: `css/style.css`,
		sourceMap: true,
		sourceMapContents: true,
		outputStyle: "compressed",
	})

	console.log(styleResult.css.toString())

	await writeFilePromise("css/style.css", styleResult.css);
	await writeFilePromise("css/style.css.map", styleResult.map);
}
main()