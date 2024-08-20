# Solidity

## instanceIndex has to be fetch into the Postgres database.
## gameType can only be "Pongy" or "Fighty".

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
	"player1": "player1",
	"player2": "player2",
	"score1": 0,
	"score2": 5
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
	"players": ["player1", "player2", "player3", "player4"] // accept 4 or 8 players
}
```

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|success| Tournament added | 200 |
|missing fields| Data isn't format as expected | 450 |
|exception| catched exception | 400 |


## /solidity/addtournamentgame/\<instanceIndex>/\<gameType>/

Request Method: **POST**

JSON file:
```json
{
	"player1": "player1",
	"player2": "player2",
	"score1": 0,
	"score2": 5
}
```

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|success| Tournament game added | 200 |
|missing fields| Data isn't format as expected | 450 |
|exception| catched exception | 400 |


## /solidity/getgames/\<instanceIndex>/\<gameType>/

Request Method: **GET**

JSON file: *(null)*

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|success| Returns all the games | 200 |
|exception| catched exception | 400 |


## /solidity/getnexttournamentplayers/\<instanceIndex>/\<gameType>/

Request Method: **GET**

JSON file: *(null)*

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|success| Returns the two next tournament game players | 200 |
|exception| catched exception | 400 |


## /solidity/getlasttournamentranking/\<instanceIndex>/\<gameType>/

Request Method: **GET**

JSON file: *(null)*

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|success| Returns the ranking of the tournament | 200 |
|exception| catched exception | 400 |

## /solidity/getalltournamentsrankings/\<instanceIndex>/\<gameType>/

Request Method: **GET**

JSON file: *(null)*

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|success| Returns the ranking of the tournament | 200 |
|exception| catched exception | 400 |