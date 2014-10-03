stream-csv
==========

read a CSV or TSV file line-by-line, applying headers to each row. Convenient for very large files.

##Installation

	npm install node-stream-csv

## How to use

`streamCSV` takes three arguments: A filename, a callback for each row, and a callback when it's done. The last is optional.

## Examples

These are all examples from `test/test.js`

	var streamCSV = require("stream-csv");

	streamCSV("state_population.tsv", function(county) {
		console.log(county);
	});

	/* Input

	SUMLEV	REGION	DIVISION	STATE	NAME	POPESTIMATE2013	POPEST18PLUS2013	PCNT_POPEST18PLUS
	10	0	0	0	United States	316128839	242542967	76.7
	40	3	6	1	Alabama	4833722	3722241	77
	40	4	9	2	Alaska	735132	547000	74.4
	*/

	/* Output:
	{ SUMLEV: 10,
	  REGION: 0,
	  DIVISION: 0,
	  STATE: 0,
	  NAME: 'United States',
	  POPESTIMATE2013: 316128839,
	  POPEST18PLUS2013: 242542967,
	  PCNT_POPEST18PLUS: 76.7 }
	{ SUMLEV: 40,
	  REGION: 3,
	  DIVISION: 6,
	  STATE: 1,
	  NAME: 'Alabama',
	  POPESTIMATE2013: 4833722,
	  POPEST18PLUS2013: 3722241,
	  PCNT_POPEST18PLUS: 77 }
	{ SUMLEV: 40,
	  REGION: 4,
	  DIVISION: 9,
	  STATE: 2,
	  NAME: 'Alaska',
	  POPESTIMATE2013: 735132,
	  POPEST18PLUS2013: 547000,
	  PCNT_POPEST18PLUS: 74.4 }	  
	*/

Note that the module correctly interpreted the numbers as numbers. If you don't want this behavior, such as when you've got leading zeroes you want to preserve, pass an options object to the first argument with `dontguess`:

	streamCSV(
		{
			filename: "county_population.csv",
			dontguess: true
		},
		function(datum, c) {
			process.stdout.write("Read " + c + " lines from county file.\r");
		},
		function() { // on close 
			cb();
		}		
	);

	/* Output 
	{ SUMLEV: '050',
	  REGION: '3',
	  DIVISION: '6',
	  STATE: '01',
	  COUNTY: '001',
	  STNAME: 'Alabama',
	  CTYNAME: 'Autauga County',
	  CENSUS2010POP: '54571'
	  // etc etc
	}

##Options

+ `dontguess`: No type guessing, just import every data point as a string

+ `noheader`: The first line is a regular line of data, not a set of headers. Just give me back arrays of each line.

+ `sparse`: If there is a header but the field value is blank, don't include it in the object for that row

+ `mode`: "csv" or "tsv". If unspecified, guesses from file extension.

##Dependencies
+ This module uses [d3](https://github.com/mbostock/d3)'s [csv parser](https://github.com/mbostock/d3/wiki/CSV) on each line.

+ It uses a [fork](https://github.com/TimeMagazine/readline) of [maleck13's readline module](https://github.com/maleck13/readline) to convert the filestream into line-by-line events. The fork allows for the fact that most readline modules, including the [core module](http://nodejs.org/api/readline.html), often miss the last line of the file. The fork is distributed in this repo without the git files. 