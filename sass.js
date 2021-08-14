const sass = require("sass")

sass.renderSync({
	file: "./sass/style.sass",
	sourceMap: true,
	outFile: "./css/style.css",
	outputStyle: "compressed"
})

console.log(sass.info)