function home_hashchange(event)
{
	if (window.frontendHealthCheck === false) 
	{
		window.frontendHealthCheck = true
		checkTournamentStatus()
	}
	window.removeEventListener('hashchange', home_hashchange);
	document.getElementById('home').classList.add('hidden');
	unloadScripts(window.homeScripts);
}

function home()
{
	getAvatar()
	document.getElementById('gameType').value = 'pongyGames';
	document.getElementById('mh_username').value = window.user.username;
	loadData();
	document.getElementById('home').classList.remove('hidden');
	window.addEventListener('hashchange', home_hashchange);
	document.getElementById('profile-img').addEventListener('click', showSideBar);
}

function showSideBar() {
	const sidebar = document.getElementById('sidebar');
	//event.stopPropagation();
	if (sidebar.classList.contains('hidden')) {
		document.addEventListener('click', handleOutsideClick);
		document.getElementById('sidebar').classList.remove('hidden');
	}
	// else {
	// 	document.removeEventListener('click', handleOutsideClick);
	// }
}

function handleOutsideClick(event) {
	const sidebar = document.getElementById('sidebar');
	const isClickInsideSidebar = sidebar.contains(event.target);
	const isClickProfile = document.getElementById('profile-img').contains(event.target);

	if (!isClickInsideSidebar && !isClickProfile) {
		sidebar.classList.add('hidden');
		document.removeEventListener('click', handleOutsideClick);
	}
}

//GET PROFILE PICTURE
//todo: make sure the path is correct
function getAvatar() {
	const imgElement = document.querySelector('#profile-img img');

	if (window.user && window.user.avatar) {
		const avatar = window.user.avatar;

		if (avatar.startsWith('https://')) {
			const url = new URL(avatar);
			imgElement.src = `${url.protocol}//${window.IP}:3000/user-management${url.pathname}`;
		} else {
			imgElement.src = `https://${window.IP}:3000/user-management${avatar}`;
		}
	} else {
		imgElement.src = 'img/red.jpg';
	}
	document.getElementById('profile-img').classList.remove('hidden');
}

// GAME HISTORY TABLE

// function	fillInfos() {
// 	populateUserDropdown()
// 	fillGame()
// }

// function fillGame() {
// 	const tableBody = document.getElementById('gameHistoryTableBody');
	
// 	tableBody.innerHTML = '';

// 	Promise.all([
// 		getGames('pongy', window.user.blockchain_id),
// 		getGames('fighty', window.user.blockchain_id)
// 	])
// 	.then(([pongy_games, fighty_games]) => {
// 		const games_dict = { ...pongy_games, ...fighty_games };

// 		if (Object.keys(games_dict).length > 0) {
// 			const timestamps = Object.keys(games_dict).sort((a, b) => a - b);
// 			tableBody.innerHTML = '';

// 			for (const timestamp of timestamps) {
// 				let result = '';

// 				if (window.user.username === games_dict[timestamp].player1 || window.user.username === games_dict[timestamp].player2) {
// 					if (games_dict[timestamp].score1 > games_dict[timestamp].score2 && games_dict[timestamp].player1 === window.user.username) {
// 						result = 'Win';
// 						window.scores.wins = window.scores.wins + 1;
// 					} else if (games_dict[timestamp].score1 < games_dict[timestamp].score2 && games_dict[timestamp].player2 === window.user.username) {
// 						result = 'Win';
// 						window.scores.wins = window.scores.wins + 1;
// 					} else {
// 						window.scores.losses = window.scores.losses + 1;
// 						result = 'Loss';
// 					}
// 				} else {
// 					result = 'N/A';
// 				}

// 				let game_name = '';

// 				if (games_dict[timestamp].tournament_id != -1) {
// 					game_name = games_dict[timestamp].game_type + ' Tournament' + games_dict[timestamp].tournament_id;
// 				}	else {
// 					game_name = games_dict[timestamp].game_type;
// 				}

// 				const newRow = document.createElement("tr");
// 				newRow.innerHTML = `
// 					<td>${game_name}</td>
// 					<td>${games_dict[timestamp].player1}</td>
// 					<td>${games_dict[timestamp].player2}</td>
// 					<td>${games_dict[timestamp].score1}</td>
// 					<td>${games_dict[timestamp].score2}</td>
// 					<td>${result}</td>
// 				`;

// 				tableBody.appendChild(newRow);
// 			}
// 		} else {
// 			const noDataRow = document.createElement("tr");
// 			noDataRow.innerHTML = '<td colspan="7" class="text-center">No data available.</td>';
// 			tableBody.appendChild(noDataRow);
// 			window.scores.wins = 0;
// 			window.scores.losses = 0;
// 		}
// 		fillWinLoss()
// 	})
// 	.catch(error => {
// 		console.error("Error fetching games:", error.message || "An unknown error occurred");
// 	});

// }

// function getGames(gameType, instance) {
// 	const url = `https://${window.IP}:3000/solidity/solidity/get${gameType}games/${instance}/`;
// 	return fetch(url, {
// 		method: 'GET',
// 		headers: {
// 			'Content-Type': 'application/json',
// 		},
// 	})
// 	.then(response => {
// 		if (!response.ok) {
// 			throw new Error(`Failed to fetch ${gameType} games: ${response.statusText}`);
// 		}
// 		return response.json();
// 	})
// 	.then(data => {
// 		const matchDictionary = {};
// 		data.success.forEach(game => {
// 			const info = {
// 				timestamp: game[1],
// 				players: game[2],
// 				scores: game[3],
// 				player1: players[0],
// 				player2: players[1],
// 				score1: scores[0],
// 				score2: scores[1],
// 			}
// 			matchDictionary[info.timestamp] = {
// 				game_type: gameType,
// 				player1: info.player1,
// 				player2: info.player2,
// 				score1: info.score1,
// 				score2: info.score2,
// 			};
// 		});

// 		const sortedKeys = Object.keys(matchDictionary).sort((a, b) => a - b);
// 		const sortedMatchDictionary = {};
// 		sortedKeys.forEach(key => {
// 			sortedMatchDictionary[key] = matchDictionary[key];
// 		});

// 		return sortedMatchDictionary;
// 	})
// 	.catch(error => {
// 		console.error(`Error fetching ${gameType} games:`, error.message);
// 		return {};
// 	});
// }

// function fillWinLoss() {
// 	const winCounter = document.getElementById('winCounter')
// 	const lossCounter = document.getElementById('lossCounter')

// 	winCounter.textContent = window.scores.wins;
// 	lossCounter.textContent = window.scores.losses;
// }

function addNotification(notificationText) {
	const tableBody = document.getElementById("notificationsTableBody");
	const newRow = document.createElement("tr");
	
	newRow.innerHTML = `
		<td>
			${notificationText}
		</td>
	`;
	
	tableBody.insertBefore(newRow, tableBody.firstChild);
}

function addPongyGameInvite(game_id, sender_username) {
	const tableBody = document.getElementById("notificationsTableBody");
	const newRow = document.createElement("tr");
	
	notificationText = "You've been invited by " + sender_username + " to a game of pongy!"
	newRow.innerHTML = `
		<td>
			<div class="notification-row">
				<span>${notificationText}</span>
				<div>
					<button class="btn btn-success btn-sm ms-2" onclick="acceptPongyGameInvite(this, ${game_id})">Accept</button>
					<button class="btn btn-danger btn-sm" onclick="declinePongyGameInvite(this)">Decline</button>
				</div>
			</div>
		</td>
	`;
	
	tableBody.insertBefore(newRow, tableBody.firstChild);
}

async function acceptPongyGameInvite(button, game_id) {
	const buttons = button.parentElement.querySelectorAll('button');
	buttons.forEach(btn => btn.remove());

	window.invite_hash_change = true;
	window.location.hash = '#game'

	data = {
		game_id: game_id
	}

	await PromiseloadScripts(window.gameScripts);
	startMatchmakingLobby(data)
}

function declinePongyGameInvite(button) {
	const buttons = button.parentElement.querySelectorAll('button');
	buttons.forEach(btn => btn.remove());
}

function addFightyGameInvite(sender) {
	const tableBody = document.getElementById("notificationsTableBody");
	const newRow = document.createElement("tr");
	
	notificationText = "You've been invited by " + sender.username + " to a game of fighty!"
	newRow.innerHTML = `
		<td>
			<div class="notification-row">
				<span>${notificationText}</span>
				<div>
					<button class="btn btn-success btn-sm ms-2" onclick="acceptFightyGameInvite(this, ${sender.id}, '${sender.username}', ${sender.skin}, ${sender.game_id})">Accept</button>
					<button class="btn btn-danger btn-sm" onclick="declineFightyGameInvite(this, ${sender.id}, '${sender.username}', ${sender.skin}, ${sender.game_id})">Decline</button>
				</div>	
			</div>
		</td>
	`;
	
	tableBody.insertBefore(newRow, tableBody.firstChild);
}

async function acceptFightyGameInvite(button, id, UserName, skin, game_id) {
	const buttons = button.parentElement.querySelectorAll('button');
	buttons.forEach(btn => btn.remove());
	alert("Notification accepted!");
	// todo: Add further logic for accepting the notification
	const sender = {
		id: id,
		username: UserName, 
		skin: skin,
		game_id: game_id
	}


	const receiver = {
		id: window.user.id,
		username: window.user.username,
		skin: window.user.preferences.fighty_skin,
		game_id: game_id
	}

	
	window.location.hash = '#fighters'

	document.getElementById('games').classList.remove("hidden")
	unloadScripts(window.menuScripts)
	
	
	await PromiseloadScripts(window.matchmakingScripts)
	Matchmaking_before_game(true, sender, receiver) 
}

function declineFightyGameInvite(button, sender) {
	const buttons = button.parentElement.querySelectorAll('button');
	buttons.forEach(btn => btn.remove());
	alert("Notification declined!");

	
	// todo: Add further logic for declining the notification
}

function addFriendRequest(sender_id, sender_username) {
	const tableBody = document.getElementById("notificationsTableBody");
	const newRow = document.createElement("tr");
	
	notificationText = "Friend Request from: " + sender_username
	newRow.innerHTML = `
		<td>
			<div class="notification-row">
				<span>${notificationText}</span>
				<div>
					<button class="btn btn-success btn-sm ms-2" onclick="acceptFriendRequest(this, '${sender_id}')">Accept</button>
					<button class="btn btn-danger btn-sm" onclick="declineFriendRequest(this, '${sender_id}')">Decline</button>
				</div>
			</div>
		</td>
	`;
	
	tableBody.insertBefore(newRow, tableBody.firstChild);
}

function acceptFriendRequest(button, sender_id) {
	const buttons = button.parentElement.querySelectorAll('button');
	buttons.forEach(btn => btn.remove());
	accept_friend_request(sender_id)
}

function declineFriendRequest(button, sender_id) {
	const buttons = button.parentElement.querySelectorAll('button');
	buttons.forEach(btn => btn.remove());
	deny_friend_request(sender_id)
}

async function checkTournamentStatus()
{
	
	let fightyStatus = await window.getTournamentStatus("Fighty")
	let pongyStatus = await window.getTournamentStatus("Pongy")

	
	if (fightyStatus)
		fightyTournamentData.retriveTournamentInfo()
	if (pongyStatus)
		pongyTournamentData.retriveTournamentInfo()
}

async function loadData() {
	const gameType = document.getElementById('gameType').value;
	const username = document.getElementById('mh_username').value;

	try {
		const user = await get_user_info(username);
		const apiPaths = {
			pongyGames: `/solidity/solidity/getpongygames/${user.blockchain_id}`,
			fightyGames: `/solidity/solidity/getfightygames/${user.blockchain_id}`,
			pongyTournaments: `/solidity/solidity/getpongytournaments/${user.blockchain_id}`,
			fightyTournaments: `/solidity/solidity/getfightytournaments/${user.blockchain_id}`
		};

		fetch(apiPaths[gameType])
			.then(response => response.json())
			.then(data => {
				const tableBody = document.querySelector('#resultsTable tbody');
				tableBody.innerHTML = '';

				const results = data.success;
				results.forEach(result => {
					const row = document.createElement('tr');

					if (gameType === 'pongyGames' || gameType === 'fightyGames') {
						row.innerHTML = `
							<td>${result[0]}</td>
							<td>${new Date(result[1] * 1000).toLocaleString()}</td>
							<td>${result[2].join(' vs ')}</td>
							<td>${result[3].join(' - ')}</td>
						`;
					}
					else {
						const tournamentMatches = result[3];
						tournamentMatches.forEach(match => {
							const matchRow = document.createElement('tr');
							matchRow.innerHTML = `
								<td>${match[0]}</td>
								<td>${new Date(match[1] * 1000).toLocaleString()}</td>
								<td>${match[2].join(' vs ')}</td>
								<td>${match[3].join(' - ')}</td>
							`;
							tableBody.insertBefore(matchRow, tableBody.firstChild);
						});
					}

					tableBody.insertBefore(row, tableBody.firstChild);
				});
			})
			.catch(error => console.error('Error fetching data:', error));
	}	catch	{
		toast_alert("User not found")
	}
}
