"use strict";

var Engine = require('./Engine');

var flag = process.argv[2];
var name = process.argv[3];

if ((flag !== '-s' && flag !== '-w') || !name)
{
	console.log('Usage: node RunUpdate.js -s "Player Name" (-s for strongest link or use -w for weakest link)');
	process.exit(1);
}

var data = Engine.loadData();
var initialLogsLength = data.log.length;

// do the update
if (flag === '-s')
	Engine.updateStandings(data, name, null);
else
	Engine.updateStandings(data, null, name);

Engine.selectNextRound(data);
Engine.save(data);

for (var i = initialLogsLength; i < data.log.length; i++)
{
	console.log(data.log[i]);
}

if (!data.winners || data.winners.length === 0)
	console.log('The next round is: ' + data.rounds[data.rounds.length - 1].playerNames.join(', '));
