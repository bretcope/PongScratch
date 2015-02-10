"use strict";

var readline = require('readline');

// polyfill
if (!String.prototype.repeat)
{
	String.prototype.repeat = function (count)
	{
		var ret = '';
		for (var i = 0; i < count; i++)
			ret += this;

		return ret;
	}
}

function runSimulation (names)
{
	var players = names.map(function (name) { return new Player(name); });
	players.sort(function (a, b) { return b.weight - a.weight; });
	printPlayers(players);

	// start with a randomized list
	var eligible = players.filter(function () { return true; });
	eligible.sort(function () { return Math.random() - .5; });

	var canEliminate = 1;
	var round = 1;
	var rl = readline.createInterface({input: process.stdin, output: process.stdout});

	prompt();

	function prompt ()
	{
		rl.question('Press enter to run next match...', runInner);
	}

	function runInner ()
	{
		console.log('=== ROUND ' + round + ' ===');

		var mps = runMatch(eligible);

		var i;
		/** @type {MatchPlayer} */
		var mp;
		/** @type {Player} */
		var p;
		/** @type {Player} */
		var strongest = null;

		// update stats and eliminate the weakest link (if any)
		for (i = 0; i < mps.length; i++)
		{
			mp = mps[i];
			p = mp.player;

			p.rounds++;
			p.wins += mp.wins;
			p.losses += mp.losses;

			if (mp.wins == 0)
			{
				p.eliminated = true;
				canEliminate--;
				//canEliminate = 0;
				eligible = filterEligible(eligible);
				console.log(p.name + ' was the weakest link and has been eliminated.');
			}
			else if (mp.losses == 0)
			{
				strongest = p;
				console.log(p.name + ' was the strongest link.');
			}
		}

		// see if we can eliminate anyone else
		if (canEliminate > 0)
		{
			canEliminate = Math.min(canEliminate, eligible.length - 4); // don't eliminate everyone!

			// select the worst player from the current game
			var worst = mps.reduce(function (prev, mp)
			{
				// strongest link, and players with fewer than 2 rounds, are immune to auto-elimination
				if (mp.player === strongest || mp.player.rounds < 2 || mp.player.eliminated)
					return prev;

				if (!prev)
					return mp.player;

				if (mp.player.getRatio() < prev.getRatio())
					return mp.player;

				if (mp.player.getRatio() == prev.getRatio() && mp.player.rounds > prev.rounds)
					return mp.player;
			}, null);

			if (worst)
			{
				var worstRatio = worst.getRatio();
				var candidates = eligible.filter(function (p) { return p.getRatio() <= worstRatio && p.rounds >= worst.rounds; });

				if (candidates.length > 0)
				{
					candidates.sort(comparePlayersScore);
					var actualWorst = candidates[0].getRatio();
					var ties = 1;
					for (i = 1; ties < candidates.length; i++)
					{
						if (candidates[i].getRatio() == actualWorst)
							ties++;
						else
							break;
					}

					if (ties <= canEliminate)
					{
						for (i = 0; i < ties; i++)
						{
							console.log(candidates[i].name + ' was automatically eliminated.');
							candidates[i].eliminated = true;
							canEliminate--;
						}

						eligible = filterEligible(eligible);
					}
				}
			}
		}

		printPlayers(players);

		if (eligible.length == 4)
		{
			console.log('Winners have been selected: ' + eligible.map(function (p) { return p.name; }).join(', '));
			rl.close();
			process.exit();
		}
		else
		{
			prompt();
			round++;
			canEliminate++;
			//canEliminate = 1;
		}
	}
}

/**
 * @param players {Player[]}
 * @returns {Player[]}
 */
function filterEligible (players)
{
	return players.filter(function (p) { return !p.eliminated; });
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
	var diff = a.getRatio() - b.getRatio();
	if (diff === 0)
		return b.rounds - a.rounds;

	return diff;
}

// returns the list of MatchPlayers
function runMatch (eligible)
{
	//var eligible = players.filter(function (p) { return !p.eliminated; });
	eligible.sort(function (a, b) { return a.rounds - b.rounds; });
	var mps = new Array(4);
	var i;
	for (i = 0; i < 4; i++)
	{
		mps[i] = new MatchPlayer(eligible[i]);
	}

	console.log('Selected: ' + mps.map(function (mp) { return mp.player.name; }).join(', '));

	// all three permutations
	runGame(mps[0], mps[1], mps[2], mps[3]);
	runGame(mps[0], mps[2], mps[1], mps[3]);
	runGame(mps[0], mps[3], mps[1], mps[2]);

	var p, mp;
	for (i = 0; i < mps.length; i++)
	{
		mp = mps[i];
		p = mp.player;
	}

	return mps;
}

function runGame (a1, a2, b1, b2)
{
	if (a1.weight + a2.weight > b1.weight + b2.weight)
	{
		a1.wins++;
		a2.wins++;
		b1.losses++;
		b2.losses++;
	}
	else
	{
		b1.wins++;
		b2.wins++;
		a1.losses++;
		a2.losses++;
	}
}

function Player (name)
{
	this.name = name;
	this.wins = 0;
	this.losses = 0;
	this.rounds = 0;
	this.eliminated = false;
	this.weight = Math.random();
}

Player.prototype.getRatio = function ()
{
	var sum = this.wins + this.losses;
	if (sum === 0)
		return 0;

	return this.wins / sum;
};

function MatchPlayer (player)
{
	this.player = player;
	this.wins = 0;
	this.losses = 0;
	this.weight = player.weight * (Math.random() + .5); // introduce some randomness into how good the player is playing this match (50% to 150%)
}

function printPlayers (players)
{
	console.log("   W  L  R   Pct Player");
	for (var i = 0; i < players.length; i++)
	{
		printPlayer(players[i]);
	}

	console.log();
}

function printPlayer (p)
{
	var e = p.eliminated ? "X " : "  ";
	console.log(e + pad(p.wins, 2, true) + ' ' +
	pad(p.losses, 2, true) + ' ' +
	pad(p.rounds, 2, true) + ' ' +
	p.getRatio().toFixed(3) + ' ' +
	p.name + ' (' + p.weight.toFixed(3) + ')');
}

function pad (str, length, padLeft)
{
	str = String(str);
	var diff = length - str.length;
	if (diff > 0)
	{
		var pad = " ".repeat(diff);
		return padLeft ? pad + str : str + pad;
	}

	return str;
}

runSimulation([
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
]);
