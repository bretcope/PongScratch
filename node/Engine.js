"use strict";

var Fs = require('fs');
var Path = require('path');
var Player = require('./Player');
var Round = require('./Round');

var Engine = module.exports;

Engine.dataFilePath = Path.join(__dirname, '..', 'data.js');
Engine.roundsFilePath = Path.join(__dirname, '..', 'rounds.js');

Engine.save = function (data)
{
	Fs.writeFileSync(Engine.dataFilePath, template('pongData', data));
};

Engine.setInitialData = function (playerNames)
{
	var data = {};
	
	data.players = playerNames.map(function (name)
	{
		return new Player({ name: name });
	});
	
	// start with a randomly ordered list
	data.players.sort(function () { return Math.random() - .5; });
	
	data.rounds = [];
	data.winners = null;
	data.log = [];
	
	Engine.selectNextRound(data);
	Engine.save(data);
	
	return data;
};

Engine.loadData = function ()
{
	var data = require(Engine.dataFilePath);
	
	data.players = data.players.map(function (p) { return new Player(p); });
	data.rounds = data.rounds.map(function (r) { return new Round(r); });
	
	return data;
};

Engine.updateStandings = function (data, strongestName, weakestName)
{
	if (data.winners && data.winners.length > 0)
		return;
	
	/** @type {Round} */
	var lastRound = data.rounds[data.rounds.length - 1];
	
	if (lastRound.strongest || lastRound.weakest)
		throw new Error('The last round has already been recorded.');
	
	// make sure name is in last round
	var name = strongestName || weakestName;
	if (!lastRound.playerNames.some(function (n) { return n === name; }))
		throw new Error('Player ' + name + ' was not in the last round. The last round was: ' + lastRound.playerNames.join(', '));
	
	/** @type {Player} */
	var strongest = null;
	/** @type {Player} */
	var weakest = null;
	
	var i;
	/** @type {Player} */
	var p;
	
	if (strongestName)
	{
		lastRound.strongest = strongestName;
		strongest = getPlayerByName(strongestName, data);
		data.log.push(strongest.name + ' was the strongest link.');
	}
	if (weakestName)
	{
		lastRound.weakest = weakestName;
		weakest = getPlayerByName(weakestName, data);
		weakest.eliminated = true; // weakest player is always eliminated
		data.log.push(weakest.name + ' was the weakest link and has been eliminated.');
	}
	
	if ((strongest && weakest) || (!strongest && !weakest))
	{
		throw new Error('Must be a strongest or a weakest, but not both.');
	}
	
	/** @type {Player[]} */
	var lastGamePlayers = lastRound.playerNames.map(function (n) { return getPlayerByName(n, data); });
	
	// update their stats
	for (i = 0; i < lastGamePlayers.length; i++)
	{
		p = lastGamePlayers[i];
		p.rounds++;
		if (strongest)
		{
			if (p === strongest)
			{
				p.wins += 3;
			}
			else
			{
				p.wins += 1;
				p.losses += 2;
			}
		}
		else
		{
			if (p === weakest)
			{
				p.losses += 3;
			}
			else
			{
				p.wins += 2;
				p.losses += 1;
			}
		}
	}
	
	// see if anyone else needs to be eliminated
	var eligible = getEligiblePlayers(data);
	var eliminatedCount = data.players.length - eligible.length;
	if (eliminatedCount < rounds.length)
	{
		var canEliminate = Math.min(eligible.length - 4, rounds.length - eliminatedCount);

		// select the worst player from the most recent game who was not a weakest link
		/** @type {Player} */
		var worst = lastGamePlayers.reduce(function (prev, p)
		{
			// strongest link, and players with fewer than 2 rounds, are immune to auto-elimination
			if (p === strongest || p.rounds < 2 || p.eliminated)
				return prev;

			if (!prev)
				return p;

			if (p.winsRatio < prev.winsRatio)
				return p;

			if (p.winsRatio == prev.winsRatio && p.rounds > prev.rounds)
				return p;
		}, null);

		if (worst)
		{
			// select everyone who has played at least as many games as the worst player from the current game, and has the same or worse wins ratio
			var worstRatio = worst.winsRatio;
			var candidates = eligible.filter(function (p) { return p.winsRatio <= worstRatio && p.rounds >= worst.rounds; });

			if (candidates.length > 0)
			{
				candidates.sort(comparePlayersScore);
				var actualWorst = candidates[0].winsRatio;
				var ties = 1;
				for (i = 1; ties < candidates.length; i++)
				{
					if (candidates[i].winsRatio == actualWorst)
						ties++;
					else
						break;
				}

				if (ties <= canEliminate)
				{
					for (i = 0; i < ties; i++)
					{
						data.log.push(candidates[i].name + ' was automatically eliminated.');
						candidates[i].eliminated = true;
					}
				}
			}
		}
	}
};

Engine.selectNextRound = function (data)
{
	var eligible = getEligiblePlayers(data);
	
	// pick players (give preference to players who have played fewer rounds)
	eligible.sort(function (a, b) { return a.rounds - b.rounds; });
	
	var names = [];
	for (var i = 0; i < 4; i++)
		names.push(eligible[i].name);

	if (eligible.length === 4)
	{
		data.log.push('Winners have been selected: ' + names.join(', '));
		data.winners = names;
		return;
	}
	
	var round = new Round({ playerNames: names });
	data.rounds.push(round);
};

function template (name, data)
{
	return "(function(){var x = " +
		JSON.stringify(data, null, '\t') +
		"; if (typeof module !== 'undefined') module.exports = x; if (typeof window !== 'undefined') window."+ name +" = x;})();";
}

/**
 * @param data
 * @return {Player[]}
 */
function getEligiblePlayers (data)
{
	return data.players.filter(function (p) { return !p.eliminated; });
}

function getPlayerByName(name, data)
{
	for (var i = 0; i < data.players.length; i++)
	{
		if (data.players[i].name === name)
			return data.players[i];
	}
	
	throw new Error('Player ' + name + ' not found.');
}

/**
 * Sorts players from lowest winning ratio to highest. If winning ratios are the same,
 * the player who has played fewer rounds will be rated higher.
 * @param a {Player}
 * @param b {Player}
 * @return {number}
 */
function comparePlayersScore (a, b)
{
	var diff = a.winsRatio - b.winsRatio;
	if (diff === 0)
		return b.rounds - a.rounds;

	return diff;
}
