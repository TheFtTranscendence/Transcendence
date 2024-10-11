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
		normal: {
			attack1: { imageSrc: 'game2/assets/Mask/Sprites/normal/Attack1.png', framesMax: 4, time: 15 },
			attack2: { imageSrc: 'game2/assets/Mask/Sprites/normal/Attack2.png', framesMax: 4, time: 15 },
			death: { imageSrc: 'game2/assets/Mask/Sprites/normal/Death.png', framesMax: 7, time: 10 },
			fall: { imageSrc: 'game2/assets/Mask/Sprites/normal/Fall.png', framesMax: 2, time: 10 },
			idle: { imageSrc: 'game2/assets/Mask/Sprites/normal/Idle.png', framesMax: 4, time: 10 },
			jump: { imageSrc: 'game2/assets/Mask/Sprites/normal/Jump.png', framesMax: 2, time: 10 },
			run: { imageSrc: 'game2/assets/Mask/Sprites/normal/Run.png', framesMax: 8, time: 10 },
			hit: { imageSrc: 'game2/assets/Mask/Sprites/normal/TakeHit-silhouette.png', framesMax: 4},
		},
		inverted: {
			attack1: { imageSrc: 'game2/assets/Mask/Sprites/inverted/Attack1.png', framesMax: 4, time: 15 },
			attack2: { imageSrc: 'game2/assets/Mask/Sprites/inverted/Attack2.png', framesMax: 4, time: 15 },
			death: { imageSrc: 'game2/assets/Mask/Sprites/inverted/Death.png', framesMax: 7, time: 10 },
			fall: { imageSrc: 'game2/assets/Mask/Sprites/inverted/Fall.png', framesMax: 2, time: 10 },
			idle: { imageSrc: 'game2/assets/Mask/Sprites/inverted/Idle.png', framesMax: 4, time: 10 },
			jump: { imageSrc: 'game2/assets/Mask/Sprites/inverted/Jump.png', framesMax: 2, time: 10 },
			run: { imageSrc: 'game2/assets/Mask/Sprites/inverted/Run.png', framesMax: 8, time: 10 },
			hit: { imageSrc: 'game2/assets/Mask/Sprites/inverted/TakeHit-silhouette.png', framesMax: 4},
		}
	},

	game2SkinMask2 = {
		normal: {
			attack1: { imageSrc: 'game2/assets/Mask2/Sprites/normal/Attack1.png', framesMax: 4, time: 15 },
			attack2: { imageSrc: 'game2/assets/Mask2/Sprites/normal/Attack2.png', framesMax: 4, time: 15 },
			death: { imageSrc: 'game2/assets/Mask2/Sprites/normal/Death.png', framesMax: 7, time: 10 },
			fall: { imageSrc: 'game2/assets/Mask2/Sprites/normal/Fall.png', framesMax: 2, time: 10 },
			idle: { imageSrc: 'game2/assets/Mask2/Sprites/normal/Idle.png', framesMax: 4, time: 10 },
			jump: { imageSrc: 'game2/assets/Mask2/Sprites/normal/Jump.png', framesMax: 2, time: 10 },
			run: { imageSrc: 'game2/assets/Mask2/Sprites/normal/Run.png', framesMax: 8, time: 10 },
			hit: { imageSrc: 'game2/assets/Mask2/Sprites/normal/TakeHit-silhouette.png', framesMax: 4},
		},
		inverted: {
			attack1: { imageSrc: 'game2/assets/Mask2/Sprites/inverted/Attack1.png', framesMax: 4, time: 15 },
			attack2: { imageSrc: 'game2/assets/Mask2/Sprites/inverted/Attack2.png', framesMax: 4, time: 15 },
			death: { imageSrc: 'game2/assets/Mask2/Sprites/inverted/Death.png', framesMax: 7, time: 10 },
			fall: { imageSrc: 'game2/assets/Mask2/Sprites/inverted/Fall.png', framesMax: 2, time: 10 },
			idle: { imageSrc: 'game2/assets/Mask2/Sprites/inverted/Idle.png', framesMax: 4, time: 10 },
			jump: { imageSrc: 'game2/assets/Mask2/Sprites/inverted/Jump.png', framesMax: 2, time: 10 },
			run: { imageSrc: 'game2/assets/Mask2/Sprites/inverted/Run.png', framesMax: 8, time: 10 },
			hit: { imageSrc: 'game2/assets/Mask2/Sprites/inverted/TakeHit-silhouette.png', framesMax: 4},
		}
	},

	game2SkinMask3 = {
		normal: {
			attack1: { imageSrc: 'game2/assets/Mask3/Sprites/normal/Attack1.png', framesMax: 4, time: 15 },
			attack2: { imageSrc: 'game2/assets/Mask3/Sprites/normal/Attack2.png', framesMax: 4, time: 15 },
			death: { imageSrc: 'game2/assets/Mask3/Sprites/normal/Death.png', framesMax: 7, time: 10 },
			fall: { imageSrc: 'game2/assets/Mask3/Sprites/normal/Fall.png', framesMax: 2, time: 10 },
			idle: { imageSrc: 'game2/assets/Mask3/Sprites/normal/Idle.png', framesMax: 4, time: 10 },
			jump: { imageSrc: 'game2/assets/Mask3/Sprites/normal/Jump.png', framesMax: 2, time: 10 },
			run: { imageSrc: 'game2/assets/Mask3/Sprites/normal/Run.png', framesMax: 8, time: 10 },
			hit: { imageSrc: 'game2/assets/Mask3/Sprites/normal/TakeHit-silhouette.png', framesMax: 4},
		},
		inverted: {
			attack1: { imageSrc: 'game2/assets/Mask3/Sprites/inverted/Attack1.png', framesMax: 4, time: 15 },
			attack2: { imageSrc: 'game2/assets/Mask3/Sprites/inverted/Attack2.png', framesMax: 4, time: 15 },
			death: { imageSrc: 'game2/assets/Mask3/Sprites/inverted/Death.png', framesMax: 7, time: 10 },
			fall: { imageSrc: 'game2/assets/Mask3/Sprites/inverted/Fall.png', framesMax: 2, time: 10 },
			idle: { imageSrc: 'game2/assets/Mask3/Sprites/inverted/Idle.png', framesMax: 4, time: 10 },
			jump: { imageSrc: 'game2/assets/Mask3/Sprites/inverted/Jump.png', framesMax: 2, time: 10 },
			run: { imageSrc: 'game2/assets/Mask3/Sprites/inverted/Run.png', framesMax: 8, time: 10 },
			hit: { imageSrc: 'game2/assets/Mask3/Sprites/inverted/TakeHit-silhouette.png', framesMax: 4},
		}
	},

	game2SkinSamu = {
		normal: {
			attack1: { imageSrc: 'game2/assets/Samu/Sprites/normal/Attack1.png', framesMax: 4, time: 15 },
			attack2: { imageSrc: 'game2/assets/Samu/Sprites/normal/Attack2.png', framesMax: 4, time: 15 },
			death: { imageSrc: 'game2/assets/Samu/Sprites/normal/Death.png', framesMax: 6, time: 10 },
			fall: { imageSrc: 'game2/assets/Samu/Sprites/normal/Fall.png', framesMax: 2, time: 10 },
			idle: { imageSrc: 'game2/assets/Samu/Sprites/normal/Idle.png', framesMax: 8, time: 10 },
			jump: { imageSrc: 'game2/assets/Samu/Sprites/normal/Jump.png', framesMax: 2, time: 10 },
			run: { imageSrc: 'game2/assets/Samu/Sprites/normal/Run.png', framesMax: 8, time: 10 },
			hit: { imageSrc: 'game2/assets/Samu/Sprites/normal/Take-Hit-white-silhouette.png', framesMax: 4},
		},
		inverted: {
			attack1: { imageSrc: 'game2/assets/Samu/Sprites/inverted/Attack1.png', framesMax: 4, time: 15 },
			attack2: { imageSrc: 'game2/assets/Samu/Sprites/inverted/Attack2.png', framesMax: 4, time: 15 },
			death: { imageSrc: 'game2/assets/Samu/Sprites/inverted/Death.png', framesMax: 6, time: 10 },
			fall: { imageSrc: 'game2/assets/Samu/Sprites/inverted/Fall.png', framesMax: 2, time: 10 },
			idle: { imageSrc: 'game2/assets/Samu/Sprites/inverted/Idle.png', framesMax: 8, time: 10 },
			jump: { imageSrc: 'game2/assets/Samu/Sprites/inverted/Jump.png', framesMax: 2, time: 10 },
			run: { imageSrc: 'game2/assets/Samu/Sprites/inverted/Run.png', framesMax: 8, time: 10 },
			hit: { imageSrc: 'game2/assets/Samu/Sprites/inverted/Take-Hit-white-silhouette.png', framesMax: 4},
		}
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
