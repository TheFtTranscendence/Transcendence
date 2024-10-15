const currentUser = {
	username: "",
	email: "" //Not set
};

window.authScripts = [
	'auth/init.js'
]

window.chatScripts = [
	'chat1/chat.js',
];

window.homeScripts = [

	'home/init.js',
];

window.gameScripts = [
	'game/gameScript.js',
];

window.menuScripts = [
	'games_menu/main.js',
	'games_menu/local.js',
	'games_menu/tournament_menu.js',
];

window.tournamentScripts = [
	'games_menu/tournament.js',
];

window.game2Scripts = [
	'game2/before_game.js',
	// 'game2/classes.js', Already loaded on index.html
	'game2/events.js',
	'game2/init.js',
	'game2/game_end.js',
	'game2/gameScript2.js'
];

window.matchmakingScripts = [
	'matchmaking/before_game.js',
	// 'matchmaking/classes.js',
	'matchmaking/events.js',
	'matchmaking/init.js',
	'matchmaking/game_end.js',
	'matchmaking/gameScript2.js',
	'matchmaking/matchmaking.js'
];

/* ----------------------- Game 1 Skins ----------------------- */

window.game1Skins = [
	bluePaddle = 'game/assets/blue_paddle.png',
	greenPaddle = 'game/assets/green_paddle.png',
	pinkPaddle = 'game/assets/pink_paddle.png',
	redPaddle = 'game/assets/red_paddle.png',
]

window.game1SkinsPreview = [
	bluePaddle = 'game/assets/blue_paddle_preview.png',
	greenPaddle = 'game/assets/green_paddle_preview.png',
	pinkPaddle = 'game/assets/pink_paddle_preview.png',
	redPaddle = 'game/assets/red_paddle_preview.png',
]


/* ----------------------- Game 2 Skins ----------------------- */

window.game2SkinsPreviews = [
	Mask = 'game2/assets/Mask/Sprites/normal_preview.gif',
	Mask2 = 'game2/assets/Mask2/Sprites/normal_preview.gif',
	Mask3 = 'game2/assets/Mask3/Sprites/normal_preview.gif',

	Samu = 'game2/assets/Samu/Sprites/normal_preview.gif',
]

window.game2SkinsPreviewsInverted = [
	Inverted_Mask = 'game2/assets/Mask/Sprites/inverted_preview.gif',
	Inverted_Mask2 = 'game2/assets/Mask2/Sprites/inverted_preview.gif',
	Inverted_Mask3 = 'game2/assets/Mask3/Sprites/inverted_preview.gif',

	Inverted_Samu = 'game2/assets/Samu/Sprites/inverted_preview.gif',
]

window.game2Skins = [

	game2SkinMask = {
			attack1: { imageSrc: 'game2/assets/Mask/Sprites/normal/Attack1.png', framesMax: 4, time: 15 },
			attack2: { imageSrc: 'game2/assets/Mask/Sprites/normal/Attack2.png', framesMax: 4, time: 15 },
			death: { imageSrc: 'game2/assets/Mask/Sprites/normal/Death.png', framesMax: 7, time: 10 },
			fall: { imageSrc: 'game2/assets/Mask/Sprites/normal/Fall.png', framesMax: 2, time: 10 },
			idle: { imageSrc: 'game2/assets/Mask/Sprites/normal/Idle.png', framesMax: 4, time: 10 },
			jump: { imageSrc: 'game2/assets/Mask/Sprites/normal/Jump.png', framesMax: 2, time: 10 },
			run: { imageSrc: 'game2/assets/Mask/Sprites/normal/Run.png', framesMax: 8, time: 10 },
			hit: { imageSrc: 'game2/assets/Mask/Sprites/normal/TakeHit-silhouette.png', framesMax: 4},

			attack1Inv: { imageSrc: 'game2/assets/Mask/Sprites/inverted/Attack1.png', framesMax: 4, time: 15 },
			attack2Inv: { imageSrc: 'game2/assets/Mask/Sprites/inverted/Attack2.png', framesMax: 4, time: 15 },
			deathInv: { imageSrc: 'game2/assets/Mask/Sprites/inverted/Death.png', framesMax: 7, time: 10 },
			fallInv: { imageSrc: 'game2/assets/Mask/Sprites/inverted/Fall.png', framesMax: 2, time: 10 },
			idleInv: { imageSrc: 'game2/assets/Mask/Sprites/inverted/Idle.png', framesMax: 4, time: 10 },
			jumpInv: { imageSrc: 'game2/assets/Mask/Sprites/inverted/Jump.png', framesMax: 2, time: 10 },
			runInv: { imageSrc: 'game2/assets/Mask/Sprites/inverted/Run.png', framesMax: 8, time: 10 },
			hitInv: { imageSrc: 'game2/assets/Mask/Sprites/inverted/TakeHit-silhouette.png', framesMax: 4},
		},

	game2SkinMask2 = {
			attack1: { imageSrc: 'game2/assets/Mask2/Sprites/normal/Attack1.png', framesMax: 4, time: 15 },
			attack2: { imageSrc: 'game2/assets/Mask2/Sprites/normal/Attack2.png', framesMax: 4, time: 15 },
			death: { imageSrc: 'game2/assets/Mask2/Sprites/normal/Death.png', framesMax: 7, time: 10 },
			fall: { imageSrc: 'game2/assets/Mask2/Sprites/normal/Fall.png', framesMax: 2, time: 10 },
			idle: { imageSrc: 'game2/assets/Mask2/Sprites/normal/Idle.png', framesMax: 4, time: 10 },
			jump: { imageSrc: 'game2/assets/Mask2/Sprites/normal/Jump.png', framesMax: 2, time: 10 },
			run: { imageSrc: 'game2/assets/Mask2/Sprites/normal/Run.png', framesMax: 8, time: 10 },
			hit: { imageSrc: 'game2/assets/Mask2/Sprites/normal/TakeHit-silhouette.png', framesMax: 4},

			attack1Inv: { imageSrc: 'game2/assets/Mask2/Sprites/inverted/Attack1.png', framesMax: 4, time: 15 },
			attack2Inv: { imageSrc: 'game2/assets/Mask2/Sprites/inverted/Attack2.png', framesMax: 4, time: 15 },
			deathInv: { imageSrc: 'game2/assets/Mask2/Sprites/inverted/Death.png', framesMax: 7, time: 10 },
			fallInv: { imageSrc: 'game2/assets/Mask2/Sprites/inverted/Fall.png', framesMax: 2, time: 10 },
			idleInv: { imageSrc: 'game2/assets/Mask2/Sprites/inverted/Idle.png', framesMax: 4, time: 10 },
			jumpInv: { imageSrc: 'game2/assets/Mask2/Sprites/inverted/Jump.png', framesMax: 2, time: 10 },
			runInv: { imageSrc: 'game2/assets/Mask2/Sprites/inverted/Run.png', framesMax: 8, time: 10 },
			hitInv: { imageSrc: 'game2/assets/Mask2/Sprites/inverted/TakeHit-silhouette.png', framesMax: 4},
		},

	game2SkinMask3 = {
			attack1: { imageSrc: 'game2/assets/Mask3/Sprites/normal/Attack1.png', framesMax: 4, time: 15 },
			attack2: { imageSrc: 'game2/assets/Mask3/Sprites/normal/Attack2.png', framesMax: 4, time: 15 },
			death: { imageSrc: 'game2/assets/Mask3/Sprites/normal/Death.png', framesMax: 7, time: 10 },
			fall: { imageSrc: 'game2/assets/Mask3/Sprites/normal/Fall.png', framesMax: 2, time: 10 },
			idle: { imageSrc: 'game2/assets/Mask3/Sprites/normal/Idle.png', framesMax: 4, time: 10 },
			jump: { imageSrc: 'game2/assets/Mask3/Sprites/normal/Jump.png', framesMax: 2, time: 10 },
			run: { imageSrc: 'game2/assets/Mask3/Sprites/normal/Run.png', framesMax: 8, time: 10 },
			hit: { imageSrc: 'game2/assets/Mask3/Sprites/normal/TakeHit-silhouette.png', framesMax: 4},

			attack1Inv: { imageSrc: 'game2/assets/Mask3/Sprites/inverted/Attack1.png', framesMax: 4, time: 15 },
			attack2Inv: { imageSrc: 'game2/assets/Mask3/Sprites/inverted/Attack2.png', framesMax: 4, time: 15 },
			deathInv: { imageSrc: 'game2/assets/Mask3/Sprites/inverted/Death.png', framesMax: 7, time: 10 },
			fallInv: { imageSrc: 'game2/assets/Mask3/Sprites/inverted/Fall.png', framesMax: 2, time: 10 },
			idleInv: { imageSrc: 'game2/assets/Mask3/Sprites/inverted/Idle.png', framesMax: 4, time: 10 },
			jumpInv: { imageSrc: 'game2/assets/Mask3/Sprites/inverted/Jump.png', framesMax: 2, time: 10 },
			runInv: { imageSrc: 'game2/assets/Mask3/Sprites/inverted/Run.png', framesMax: 8, time: 10 },
			hitInv: { imageSrc: 'game2/assets/Mask3/Sprites/inverted/TakeHit-silhouette.png', framesMax: 4},
		},

	game2SkinSamu = {
			attack1: { imageSrc: 'game2/assets/Samu/Sprites/normal/Attack1.png', framesMax: 4, time: 15 },
			attack2: { imageSrc: 'game2/assets/Samu/Sprites/normal/Attack2.png', framesMax: 4, time: 15 },
			death: { imageSrc: 'game2/assets/Samu/Sprites/normal/Death.png', framesMax: 6, time: 10 },
			fall: { imageSrc: 'game2/assets/Samu/Sprites/normal/Fall.png', framesMax: 2, time: 10 },
			idle: { imageSrc: 'game2/assets/Samu/Sprites/normal/Idle.png', framesMax: 8, time: 10 },
			jump: { imageSrc: 'game2/assets/Samu/Sprites/normal/Jump.png', framesMax: 2, time: 10 },
			run: { imageSrc: 'game2/assets/Samu/Sprites/normal/Run.png', framesMax: 8, time: 10 },
			hit: { imageSrc: 'game2/assets/Samu/Sprites/normal/Take-Hit-white-silhouette.png', framesMax: 4},

			attack1Inv: { imageSrc: 'game2/assets/Samu/Sprites/inverted/Attack1.png', framesMax: 4, time: 15 },
			attack2Inv: { imageSrc: 'game2/assets/Samu/Sprites/inverted/Attack2.png', framesMax: 4, time: 15 },
			deathInv: { imageSrc: 'game2/assets/Samu/Sprites/inverted/Death.png', framesMax: 6, time: 10 },
			fallInv: { imageSrc: 'game2/assets/Samu/Sprites/inverted/Fall.png', framesMax: 2, time: 10 },
			idleInv: { imageSrc: 'game2/assets/Samu/Sprites/inverted/Idle.png', framesMax: 8, time: 10 },
			jumpInv: { imageSrc: 'game2/assets/Samu/Sprites/inverted/Jump.png', framesMax: 2, time: 10 },
			runInv: { imageSrc: 'game2/assets/Samu/Sprites/inverted/Run.png', framesMax: 8, time: 10 },
			hitInv: { imageSrc: 'game2/assets/Samu/Sprites/inverted/Take-Hit-white-silhouette.png', framesMax: 4},
		}
]

window.tournamentVars = {
	tournamentMatch: false,
	matchNr: 0
}

window.fourPlayer = {
	firstMatchWinner: "",
	secondMatchWinner: "",
	finalWinner: ""
}

window.eightPlayer = {
	firstMatchWinner: "",
	secondMatchWinner: "",
	thirdMatchWinner: "",
	fourthMatchWinner: "",
	upperWinner: "",
	lowerWinner: "",
	finalWinner: ""
}

window.playerNames = []

window.playerSkins = []

window.pongPlayerNames = []

window.pongPlayerSkins = []

window.playerCounter = 0;

window.isGameActive = false
window.storeGame = false
window.inHome = false

/* ------------> FRONTEND TOURNAMENT HEALTHCHECK BOOLS <------------ */

window.frontendHealthCheck = false;


/* ------------> FRONTEND TOURNAMENT MANAGMENT CLASSES START <------------ */

class Match {
    constructor(player1, player2 = null) { // can recieve 1 or 2 player names
        this.players = [player1];
        if (player2) {
            this.players.push(player2);
        }
		this.matchPlayed = false;
    }
}

// TODO: Maybe need to handle the skins maybe dont. Check when implementing this class
class Tournament {
    constructor() {
        this.nrPlayers = 0;
        this.nrMatches = 0;
		this.matchCounter = 0;
		this.nrRounds = 0;
		this.roundOneMatches = 0;
		this.roundTwoMatches = 0;
		this.roundThreeMatches = 0;
        this.matchList = [];  // Array to hold Match objects
    }

	// Sets tournament size information (Number of players, rounds and matches)
    setTournamentSize(nrPlayers) {
        if (nrPlayers !== 4 && nrPlayers !== 8) {
            throw new Error("Tournament only supports 4 or 8 players.");
        }
        this.nrPlayers = nrPlayers;
        this.nrMatches = nrPlayers - 1;
		if (nrPlayers === 4) {
			this.nrRounds = 2;
			this.roundOneMatches = 2;
			this.roundTwoMatches = 1;
			this.roundThreeMatches = 0;
		}
		else {
			this.nrRounds = 3;
			this.roundOneMatches = 4;
			this.roundTwoMatches = 2;
			this.roundThreeMatches = 1;
    	}
	}

	// Adds match for all players in first round
	addStartingPlayers(playerList)
	{
		if (playerList.length !== this.nrPlayers) {
            throw new Error(`The number of players must be ${this.nrPlayers}.`);
        }

        for (let i = 0; i < playerList.length; i += 2) {
            const player1 = playerList[i];
            const player2 = playerList[i + 1];
            this.addMatch(player1, player2);
        }
	}

	// Adds the winner of a game to the next match
	addGameWinner(winner)
	{
        for (let match of this.matchList) {
            if (match.players.length === 1) {
                match.players.push(winner);
                return;
            }
        }
        // If no match with one player exists, create a new match with the winner of previous game
		this.addMatch(winner);
	}

	// Adds a Match obj to the matchList with 1 or 2 players
	addMatch(player1, player2 = null) {
        const match = new Match(player1, player2);
        this.matchList.push(match);
    }

	// Return a list with the next 2 players
	getNextTournamentMatch()
	{
		for (let match of this.matchList) {
            if (!match.matchPlayed) {
				console.log("NEXT MATCH PLAYERS: ", match.players)
                return match.players;
            }
        }
		console.log("getNextTournamentMatch | NO MORE PLAYERS IN LIST")
	}

	// Sets a match as played
	setMatchAsPlayed(players)
	{
		for (let match of this.matchList) {
			if (!match.matchPlayed && players.every(player => match.players.includes(player))) {
				match.matchPlayed = true;
				this.matchCounter++;
            }
        }
		console.log("setMatchAsPlayed | DID NOT FIND MATCH TO SET HAS PLAYED")
	}

	// Return a list with the player names ready to be shown in the tournament bracket
	getBracketPlayerList()
	{
		let bracketPlayerList = [];
		for (let match of this.matchList) {
			for (const player of match.players) {
				if (player !== null)
					bracketPlayerList.push(player);
			}
		}
		return bracketPlayerList;
	}

    getRoundInfo() {
        return {
            nrRounds: this.nrRounds,
            roundOneMatches: this.roundOneMatches,
            roundTwoMatches: this.roundTwoMatches,
            roundThreeMatches: this.roundThreeMatches
        };
	}

	getTournamentWinner()
	{
		if (this.matchCounter === this.nrMatches)
		{
			for (let match of this.matchList)
			{
				if (match.players.length === 1)
					return match.players[0]
			}
		}
		console.log("getTournamentWinner | NO WINNER FOUND")
	}

	// prints all matches stored
	printAllMatches()
	{
		console.log("--> MATCHES COUNTER <--")
		console.log("Matches Played: ", this.matchCounter)
		console.log("Matches TOTAL: ", this.nrMatches)
		console.log("--> MATCHES STORED <--")
		let counter = 1
		for (let match of this.matchList) {
			console.log("Match Number: ", counter)
			console.log("Player1 -> ", match.players[0])
			console.log("Player2 -> ", match.players[1])
			console.log("Has Match been played: ", match.matchPlayed)
			counter++
		}
	}

	// Return tournament size
	getTournamentSize()
	{
		return this.nrPlayers;
	}

	// Reset tournament once it's over
	resetTournament()
	{
        this.nrPlayers = 0;
        this.nrMatches = 0;
		this.matchCounter = 0;
		this.nrRounds = 0;
		this.roundOneMatches = 0;
		this.roundTwoMatches = 0;
		this.roundThreeMatches = 0;
        this.matchList = [];  // Clear all matches
	}

/* ------------> TOURNAMENT RECOVER FUNCS START <------------ */

	// In case frontend goes down this function retrieves the lost data from the database
	async retriveTournamentInfo()
	{
		await this.getStartingPlayersFromDatabase()
		await this.addGameWinnersFromDatabase()
	}

	// Gets tournament size information and stores them back in tournament class
	// Gets initial players names from database and stores them back in matchList
	async getStartingPlayersFromDatabase()
	{
		const databseInitialPlayers = await window.getTournamentPlayers();
		
		if (databseInitialPlayers.length === 4)
			this.setTournamentSize(4)
		else
			this.setTournamentSize(8)
		
		this.addStartingPlayers(databseInitialPlayers)
	}

	// Gets all match winners from database and stores them back in matchList
	async addGameWinnersFromDatabase()
	{
		const winnerList = []
		const databaseTournamentRankings = await window.getTournamentRankings();
		for (let player of databaseTournamentRankings) {
			const loser = player;
			const databaseAllGames = await window.getAllGames();
			for (let i = databaseAllGames.length - 1; i >= 0; i--) {
				if (loser === databaseAllGames[i][1]) {
					winnerList.push(databaseAllGames[i][2])
					break;
				}
				if (loser === databaseAllGames[i][2]) {
					winnerList.push(databaseAllGames[i][1])
					break;
				}
			}
		}
		for (let winner of winnerList) {
			this.addGameWinner(winner)
		}

		this.setMatchesPlayedFromDatabase(winnerList.length)
	}

	// Sets the number of matches as already played acording to the number of winners
	setMatchesPlayedFromDatabase(nrMatchesPlayed)
	{
		this.matchCounter = nrMatchesPlayed
		let matchesPlayed = nrMatchesPlayed
		for (let match of this.matchList) {
			if (matchesPlayed > 0) {
				match.matchPlayed = true
				matchesPlayed--
			}
			else {
				return
			}
		}
	}


/* -------------> TOURNAMENT RECOVER FUNCS END <------------- */

}

window.fightyTournamentData = new Tournament();
window.pongyTournamentData = new Tournament();

/* ------------> FRONTEND TOURNAMENT MANAGMENT CLASSES END <------------ */




/* -------------> SOLIDITY CALL FUNCS START <------------- */

// --------> GETTERS

// Blockchain API call to get initial tournament players
async function getTournamentPlayers() {
    let players = []; // Default value
    
    try {
        let url;
        // Check the hash in the URL and choose the correct API endpoint
        if (window.location.hash == '#fighters') {
            url = `https://${window.IP}:3000/solidity/solidity/getcurrenttournamentplayerslist/${window.user.blockchain_id}/Fighty`;
        } else {
            url = `https://${window.IP}:3000/solidity/solidity/getcurrenttournamentplayerslist/${window.user.blockchain_id}/Pongy`;
        }
        
        // Use await to wait for the fetch request to complete
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Check if the response is okay
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        // Parse the response JSON
        const data = await response.json();
        
        // Store the status from the response
        players = data.success;

        console.log('Current Tournament Players:', players); // Log the gameStatus
        
    } catch (error) {
        // Handle any errors
        console.error('Error:', error);
    }

    return players;
}

// Blockchain API call to get Tournament Rankings (wtv that means)
async function getTournamentRankings() {
    let tournamentRakings = {}; // Default value
    
    try {
        let url;
        // Check the hash in the URL and choose the correct API endpoint
        if (window.location.hash == '#fighters') {
            url = `https://${window.IP}:3000/solidity/solidity/getlasttournamentranking/${window.user.blockchain_id}/Fighty`;
        } else {
            url = `https://${window.IP}:3000/solidity/solidity/getlasttournamentranking/${window.user.blockchain_id}/Pongy`;
        }
        
        // Use await to wait for the fetch request to complete
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Check if the response is okay
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        // Parse the response JSON
        const data = await response.json();
        
        // Store the status from the response
        tournamentRakings = data.success;

        console.log('Current tournamentRakings:', tournamentRakings); // Log the gameStatus
        
    } catch (error) {
        // Handle any errors
        console.error('Error:', error);
    }

    return tournamentRakings;
}

// Blockchain API call to get All Tournament Rankings
async function getAllTournamentRankings() {
    let allTournamentRakings = {}; // Default value
    
    try {
        let url;
        // Check the hash in the URL and choose the correct API endpoint
        if (window.location.hash == '#fighters') {
            url = `https://${window.IP}:3000/solidity/solidity/getalltournamentsrankings/${window.user.blockchain_id}/Fighty`;
        } else {
            url = `https://${window.IP}:3000/solidity/solidity/getalltournamentsrankings/${window.user.blockchain_id}/Pongy`;
        }
        
        // Use await to wait for the fetch request to complete
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Check if the response is okay
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        // Parse the response JSON
        const data = await response.json();
        
        // Store the status from the response
        allTournamentRakings = data.success;

        console.log('Current allTournamentRakings:', allTournamentRakings); // Log the gameStatus
        
    } catch (error) {
        // Handle any errors
        console.error('Error:', error);
    }

    return allTournamentRakings;
}

// Blockchain API call to get All Games
async function getAllGames() {
    let allGames = {}; // Default value
    
    try {
        let url;
        // Check the hash in the URL and choose the correct API endpoint
        if (window.location.hash == '#fighters') {
            url = `https://${window.IP}:3000/solidity/solidity/getgames/${window.user.blockchain_id}/Fighty`;
        } else {
            url = `https://${window.IP}:3000/solidity/solidity/getgames/${window.user.blockchain_id}/Pongy`;
        }
        
        // Use await to wait for the fetch request to complete
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Check if the response is okay
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        // Parse the response JSON
        const data = await response.json();
        
        // Store the status from the response
        allGames = data.success;

        console.log('Current allGames:', allGames); // Log the gameStatus
        
    } catch (error) {
        // Handle any errors
        console.error('Error:', error);
    }

    return allGames;
}

// Blockchain API call to get Tournament Status
async function getTournamentStatus() {
    let gameStatus = false; // Default value
    
    try {
        let url;
        // Check the hash in the URL and choose the correct API endpoint
        if (window.location.hash == '#fighters') {
            url = `https://${window.IP}:3000/solidity/solidity/gettournamentstatus/${window.user.blockchain_id}/Fighty`;
        } else {
            url = `https://${window.IP}:3000/solidity/solidity/gettournamentstatus/${window.user.blockchain_id}/Pongy`;
        }
        
        // Use await to wait for the fetch request to complete
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Check if the response is okay
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        // Parse the response JSON
        const data = await response.json();
        
        // Store the status from the response
        gameStatus = data.success;

        console.log('gameStatus:', gameStatus); // Log the gameStatus
        
    } catch (error) {
        // Handle any errors
        console.error('Error:', error);
    }

    // Return the gameStatus after the fetch request completes
    return gameStatus;
}


/* -------------> SOLIDITY CALL FUNCS END <------------- */


window.isRegistering = false;

window.scores = {};
window.scores.wins = 0;
window.scores.losses = 0;
