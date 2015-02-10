"use strict";
/* -------------------------------------------------------------------
 * Require Statements << Keep in alphabetical order >>
 * ---------------------------------------------------------------- */

//

/* =============================================================================
 * 
 * Player
 *  
 * ========================================================================== */

module.exports = Player;

function Player (json)
{
	this.name = json.name;
	this.wins = json.wins || 0;
	this.losses = json.losses || 0;
	this.rounds = json.rounds || 0;
	this.eliminated = json.eliminated || false;
}

/* -------------------------------------------------------------------
 * Static Methods << Keep in alphabetical order >>
 * ---------------------------------------------------------------- */

//

/* -------------------------------------------------------------------
 * Prototype Methods << Keep in alphabetical order >>
 * ---------------------------------------------------------------- */

Object.defineProperty(Player.prototype, 'winsRatio', {
	enumerable: true,
	get: function ()
	{
		var sum = this.wins + this.losses;
		if (sum === 0)
			return 0;

		return this.wins / sum;
	}
});

/* -------------------------------------------------------------------
 * Private Methods << Keep in alphabetical order >>
 * ---------------------------------------------------------------- */

//
