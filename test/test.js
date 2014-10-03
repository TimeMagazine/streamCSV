#! /usr/local/bin/node

var streamCSV = require("../index");

// no config
function test1(cb) {
	streamCSV(
		__dirname + "/state_population.tsv",
		function(datum) { // on each line
			console.log(datum);
		},
		function() { // on close 
			cb();
		}
	);
}

// no header
function test2(cb) {
	streamCSV(
		{
			filename: __dirname + "/type_test.csv",
			noheader: true
		},
		function(datum) {
			console.log(datum);
		},
		function() { // on close 
			cb();
		}		
	);
}

function test3(cb) {
	// don't guess types
	streamCSV(
		{
			filename: __dirname + "/county_population.csv",
			dontguess: true
		},
		function(datum, c) {
			process.stdout.write("Read " + c + " lines from county file.\r");
		},
		function() { // on close 
			cb();
		}		
	);
}

test1(function() {
	test2(function() {
		test3(function() {
			console.log("\nDone!");
		});
	});
});