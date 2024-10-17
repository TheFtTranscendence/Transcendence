# Solidity

<em>
- <strong>instanceIndex</strong> has to be fetch into the Postgres database.
- <strong>gameType</strong> can only be "Pongy" or "Fighty".
</em>

## /solidity/addinstance/

Request Method: **POST**

JSON file: *(null)*

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|success| Returns the instance index | 200 |
|exception| catched exception | 400 |


## /solidity/addgame/\<instanceIndex>/\<gameType>/

Request Method: **POST**

JSON file:
```json
{
	"players": ["player1", "player2"],
	"scores": [5, 0]
}
```

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|success| Game added | 200 |
|missing fields| Data isn't format as expected | 450 |
|exception| catched exception | 400 |


## /solidity/addtournament/\<instanceIndex>/\<gameType>/

Request Method: **POST**

JSON file:
```json
{
	"players": ["player1", "player2", "player3", "player4"], // accept 4 or 8 players
	"tournamentId": 0,
    "gameName": "Pongy",
    "games": [
        {
            "gameName": "Pongy",
            "timestamp": 0,
            "players": ["a", "b"],
            "scores": [5, 0]
        },
        {
            "gameName": "Pongy",
            "timestamp": 0,
            "players": ["c", "d"],
            "scores": [0, 5]
        },
        {
            "gameName": "Pongy",
            "timestamp": 0,
            "players": ["a", "d"],
            "scores": [5, 0]
        }
    ]
}
```

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|success| Tournament added | 200 |
|missing fields| Data isn't format as expected | 450 |
|exception| catched exception | 400 |


## /solidity/getpongygames/\<instanceIndex>/

Request Method: **GET**

JSON file: *(null)*

Returns:
```json
{
	"success": [
		[
			"Pongy",
			0,	// timestamp
			[
				"player1",
				"player2"
			],
			[
				5,	// score1
				0	// score2
			]
		]
	]
}
```

| Message | Description | Status |
|--------|-------------|:-----:|
|success| Returns all the games | 200 |
|exception| catched exception | 400 |


## /solidity/getfightygames/\<instanceIndex>/

Request Method: **GET**

JSON file: *(null)*

Returns:
```json
{
	"success": [
		[
			"Fighty",
			0,	// timestamp
			[
				"player1",
				"player2"
			],
			[
				5,	// score1
				0	// score2
			]
		]
	]
}
```

| Message | Description | Status |
|--------|-------------|:-----:|
|success| Returns all the games | 200 |
|exception| catched exception | 400 |


## /solidity/getpongytournaments/\<instanceIndex>/

Request Method: **GET**

JSON file: *(null)*

Returns:
```json
{
	"success": [
		[
			"Pongy",
			0, // timestamp
			[
				"a",	// player1
				"b",	// player2
				"c",	// ...
				"d"
			],
			[
				[
					"Pongy",
					1697462400,	// timestamp
					[
						"a",	// player1
						"b"		// player2
					],
					[
						5,		// score1
						0		// score2
					]
				],
				[
					"Pongy",
					1697466000,
					[
						"c",
						"d"
					],
					[
						0,
						5
					]
				],
				[
					"Pongy",
					1697469600,
					[
						"a",
						"d"
					],
					[
						5,
						0
					]
				]
			]
		]
	]
}
```

| Message | Description | Status |
|--------|-------------|:-----:|
|success| Returns all the games | 200 |
|exception| catched exception | 400 |


## /solidity/getfightytournaments/\<instanceIndex>/

Request Method: **GET**

JSON file: *(null)*

Returns:
```json
{
	"success": [
		[
			"Fighty",
			0, // timestamp
			[
				"a",	// player1
				"b",	// player2
				"c",	// ...
				"d"
			],
			[
				[
					"Fighty",
					1697462400,	// timestamp
					[
						"a",	// player1
						"b"		// player2
					],
					[
						5,		// score1
						0		// score2
					]
				],
				[
					"Fighty",
					1697466000,
					[
						"c",
						"d"
					],
					[
						0,
						5
					]
				],
				[
					"Fighty",
					1697469600,
					[
						"a",
						"d"
					],
					[
						5,
						0
					]
				]
			]
		]
	]
}
```

| Message | Description | Status |
|--------|-------------|:-----:|
|success| Returns all the games | 200 |
|exception| catched exception | 400 |