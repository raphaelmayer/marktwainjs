const analyseText = require("marktwain.js");

/*
	EXAMPLES
*/

(()=>{
	fs.readFile("../1601.txt", (err, text) => {
		if (err) return console.log(err);
		const options = {
			ignoreNumbers: true,
			ignoreCommonWords: false,
			minLength: 5,
			language: null,
		}
		console.log(analyseText(text.toString(), options));
	})
})();