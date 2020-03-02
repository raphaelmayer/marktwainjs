const fs = require("fs");

(()=>{
	fs.readFile("../1601.txt", (err, text) => {
        if (err) return console.log(err);
        text = text.toString();
        // console.log([text]);
        const v = sanitize(text).replace(/[^A-Za-z0-9-#_ ]/gi, "").split(" ").filter(w => w !== '');
        const w = sanitize(text).replace(/[^A-Za-z0-9-#_ ]/gi, "").split(" ").splice(1, v.length);

        // console.log([w]);
        for (let i = 0; i < v.length; i++) {
            if (v[i] !== w[i]) console.log(v[i] === w[i], v[i], w[i]);
            console.log(v.splice(i-10, i+10).join(" "));
            console.log(w.splice(i-10, i+10).join(" "));
            break;
        }
    })
})();


function sanitize(string, ignn) {
	const regex = ignn ? /[^A-Za-z,.\-#_!? ]/gi : /[^A-Za-z0-9,.\-#_!? ]/gi; // ex/include numbers 
	const formatted = string.replace(/\s+/gi, " "); // replace whitespace
	return formatted.replace(regex, "").toLowerCase(); // remove non-alphanum chars (more or less)
}