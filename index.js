var fs = require("fs"),
	d3 = require("d3"),
	byline = require('./lib/readline');

module.exports = function (opts, onLine, onClose) {
	var count = 0;

	if (typeof opts === "string") {
		var filename = opts;
		opts = {};
	} else {
		if (!opts.filename) {
			console.log("Please pass a filename to streamCSV as { filename: 'myfile.csv' }");
			return null;
		}
		var filename = opts.filename;
	}

	var instream = fs.createReadStream(filename, "utf8"),
		mode = opts.mode ? opts.mode.toLowerCase() : (/\.tsv$/.test(filename) ? "tsv" : "csv"),
		header;

	var rl = byline(filename);

	rl.on('line', function(line) { 
		if (!opts.noheader && !header) {	
			header = line;
		} else {
			if (opts.noheader) {
				datum = d3[mode].parseRows(line)[0];
			} else {
				datum = d3[mode].parse(header + "\n" + line)[0];
			}

			// don't record blank rows if asked
			if (!opts.noheader && opts.sparse) {
				for (var key in datum) if (datum.hasOwnProperty[key]) {
					if (datum[key].replace(/\s+/, "") == "") {
						delete datum[key];
					}
				}
			}

			// convert to native type unless asked not to
			if (!opts.dontguess) {
				for (var key in datum) if (datum.hasOwnProperty(key)) {
					//console.log(key, datum[key]);
					datum[key] = guessType(datum[key]);
				}
			}
			onLine(datum, count);
			count += 1;
		}
	});

	rl.on("close", function() {
		if (onClose) {
			onClose();
		}
	});	
}

// rudimentary type guessing. Can be improved upon

var reserved = {
	"true": true,
	"false": false,
	"null": null
};

var guessType = module.guessType = function(str) {
	if (typeof str === "undefined") {
		return null;
	}
	if (/^-?\d+$/.test(str)) {
		return parseInt(str, 10);
	} else if (/^-?\d*\.\d+$/.test(str)) {
		return parseFloat(str);
	} else if (reserved.hasOwnProperty(str.toLowerCase())) {
		return reserved[str.toLowerCase()];
	}
	return str;
}