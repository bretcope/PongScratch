(function(){var x = {
	"players": [
		{
			"name": "Bret",
			"wins": 6,
			"losses": 3,
			"rounds": 3,
			"eliminated": true
		},
		{
			"name": "Aurelien",
			"wins": 3,
			"losses": 3,
			"rounds": 2,
			"eliminated": true
		},
		{
			"name": "Korneel",
			"wins": 2,
			"losses": 4,
			"rounds": 2,
			"eliminated": true
		},
		{
			"name": "Matt",
			"wins": 7,
			"losses": 2,
			"rounds": 3,
			"eliminated": false
		},
		{
			"name": "Steve",
			"wins": 5,
			"losses": 4,
			"rounds": 3,
			"eliminated": false
		},
		{
			"name": "Jay",
			"wins": 5,
			"losses": 4,
			"rounds": 3,
			"eliminated": false
		},
		{
			"name": "Lowell",
			"wins": 3,
			"losses": 6,
			"rounds": 3,
			"eliminated": true
		},
		{
			"name": "Jarrod",
			"wins": 0,
			"losses": 3,
			"rounds": 1,
			"eliminated": true
		},
		{
			"name": "Derek",
			"wins": 5,
			"losses": 4,
			"rounds": 3,
			"eliminated": false
		},
		{
			"name": "Max",
			"wins": 0,
			"losses": 3,
			"rounds": 1,
			"eliminated": true
		}
	],
	"rounds": [
		{
			"playerNames": [
				"Bret",
				"Aurelien",
				"Korneel",
				"Matt"
			],
			"strongest": "Bret",
			"weakest": null
		},
		{
			"playerNames": [
				"Steve",
				"Jay",
				"Lowell",
				"Jarrod"
			],
			"strongest": null,
			"weakest": "Jarrod"
		},
		{
			"playerNames": [
				"Derek",
				"Max",
				"Bret",
				"Aurelien"
			],
			"strongest": null,
			"weakest": "Max"
		},
		{
			"playerNames": [
				"Korneel",
				"Matt",
				"Steve",
				"Jay"
			],
			"strongest": "Matt",
			"weakest": null
		},
		{
			"playerNames": [
				"Lowell",
				"Derek",
				"Bret",
				"Matt"
			],
			"strongest": "Matt",
			"weakest": null
		},
		{
			"playerNames": [
				"Steve",
				"Jay",
				"Lowell",
				"Derek"
			],
			"strongest": null,
			"weakest": "Lowell"
		}
	],
	"winners": [
		"Matt",
		"Steve",
		"Jay",
		"Derek"
	],
	"log": [
		"Bret was the strongest link.",
		"Jarrod was the weakest link and has been eliminated.",
		"Max was the weakest link and has been eliminated.",
		"Aurelien was automatically eliminated.",
		"Matt was the strongest link.",
		"Korneel was automatically eliminated.",
		"Matt was the strongest link.",
		"Bret was automatically eliminated.",
		"Lowell was the weakest link and has been eliminated.",
		"Winners have been selected: Matt, Steve, Jay, Derek",
		"Winners have been selected: Matt, Steve, Jay, Derek",
		"Winners have been selected: Matt, Steve, Jay, Derek"
	]
}; if (typeof module !== 'undefined') module.exports = x; if (typeof window !== 'undefined') window.pongData = x;})();