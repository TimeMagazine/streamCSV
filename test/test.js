#! /usr/local/bin/node

var streamCSV = require("../index");


streamCSV({ filename: __dirname + "/type_test.csv", noheader: true }, function(county) {
	console.log(county);
});


/*
streamCSV({ filename: __dirname + "/county_population.csv" }, function(county, c) {
	console.log(county);
});
*/