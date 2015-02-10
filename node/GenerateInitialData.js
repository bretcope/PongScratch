"use strict";

var Engine = require('./Engine');

var playerNames = [
	'Bret',
	'Aurelien',
	'Matt',
	'Korneel',
	'Lowell',
	'Jay',
	'Derek',
	'Max',
	'Steve',
	'Jarrod'
];

var data = Engine.setInitialData(playerNames);

console.log("Initial data generated. The first round is: " + data.rounds[0].playerNames.join(', '));
