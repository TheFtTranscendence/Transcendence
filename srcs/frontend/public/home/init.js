function home_hashchange(event)
{
	document.getElementById('home').classList.add('hidden');
	unloadScripts(window.homeScripts);
}

function home()
{
	getAvatar()
	fillInfos()
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
function getAvatar() {
	const imgElement = document.querySelector('#profile-img img');

	if (window.user && window.user.avatar) {
		imgElement.src = "https://" + window.IP + ":3000/user-management/" + window.user.avatar;
	} else {
		imgElement.src = 'img/red.jpg';
	}
	document.getElementById('profile-img').classList.remove('hidden');
}

// CHANGE PROFILE PICTURE
//document.getElementById('uploadButton').addEventListener('click', triggerFileDialog);
//document.getElementById('changeProfilePicture').addEventListener('change', putAvatar);


function triggerFileDialog() {
	document.getElementById('changeProfilePicture').click();
}

async function handleUpload() {
	const fileInput = document.getElementById('avatarInput');

	console.log(fileInput.files[0]);
	if (fileInput.files.length > 0) {
		uploadAvatar(fileInput.files[0]);
		await update_user_info();
		getAvatar()
	} else {
		toast_alert('Please select a file to upload.');
	}
}

async function uploadAvatar(file) {

	const data = {
		avatar: file,
	}

	try {
		const response = await fetch(`https://${window.IP}:3000/user-management/auth/users/${window.user.id}/`, {
			method: 'PATCH',
			body: JSON.stringify(data),
			headers: {
				'Authorization': 'Token ' + window.usertoken,
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || 'Network response was not ok');
		}

		const data = await response.json();
		console.log('Avatar uploaded successfully:', data);
	} catch (error) {
		console.error('Error uploading avatar:', error);
	}
}

document.getElementById('changeUsername').addEventListener('click', handleUsernameChange);

function handleUsernameChange() {
	const changeUsernameForm = document.getElementById('changeUsernameForm');
	const submitButton = document.getElementById('submitUsernameChange');

	if (changeUsernameForm) {
		if (changeUsernameForm.classList.contains('hidden')) {
			changeUsernameForm.classList.remove('hidden');
			if (!isListenerAdded2) {
				submitButton.addEventListener('click', handleUsernameChangeForm);
				isListenerAdded2 = true; // Set to true when listener is added
			}
		} else {
			console.log("add hidden");
			changeUsernameForm.classList.add('hidden');
			submitButton.removeEventListener('click', handleUsernameChangeForm);
			isListenerAdded2 = false; // Reset the status
		}
	} else {
		console.error('Element #changeUsernameForm not found');
	}
}

function handleUsernameChangeForm() {
	event.preventDefault();

	const newUsername = document.getElementById('newusername').value;
	const errorField = document.getElementById('changeUsernameError');
	const changePasswordForm = document.getElementById('changeUsernameForm');
	const sidebar = document.getElementById('sidebar');

	modify_user("username", newUsername)
}

// LOGOUT
document.getElementById('logoutButton').addEventListener('click', handleLogout);


function handleLogout() {
	const sidebar = document.getElementById('sidebar');

	document.querySelector('nav').classList.add('hidden');
	sidebar.classList.add('hidden');
	document.removeEventListener('click', handleOutsideClick);
	localStorage.removeItem('currentUser');
	window.location.hash = '#auth';
}

// CHANGE PASSWORD
document.getElementById('changePassword').addEventListener('click', handlePasswordChange);

function handlePasswordChange() {
	const changePasswordForm = document.getElementById('changePasswordForm');
	const submitButton = document.getElementById('submitPasswordChange');

	if (changePasswordForm) {
		if (changePasswordForm.classList.contains('hidden')) {
			console.log("remove hidden");
			changePasswordForm.classList.remove('hidden');
			// Add the event listener only if it's not already added
			if (!isListenerAdded) {
				submitButton.addEventListener('click', handlePasswordChangeForm);
				isListenerAdded = true; // Set to true when listener is added
			}
		} else {
			console.log("add hidden");
			changePasswordForm.classList.add('hidden');
			submitButton.removeEventListener('click', handlePasswordChangeForm);
			isListenerAdded = false; // Reset the status
		}
	} else {
		console.error('Element #changePasswordForm not found');
	}
}

function handlePasswordChangeForm(event) {
	event.preventDefault();

	const currentPassword = document.getElementById('currentPassword').value;
	const newPassword = document.getElementById('newPassword').value;
	const confirmNewPassword = document.getElementById('confirmNewPassword').value;
	const errorField = document.getElementById('changePasswordError');
	const changePasswordForm = document.getElementById('changePasswordForm');
	const sidebar = document.getElementById('sidebar');

	const data = {
		old_password: currentPassword,
		new_password: newPassword,
		confirm_new_password: confirmNewPassword
	};


	//todo: dont think this is working
	const url = `https://${window.IP}:3000/user-management/auth/users/${window.user.id}/`;

	fetch(url, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Token ' + window.usertoken
		},
		body: JSON.stringify(data),
	})
	.then(response => {
		if (!response.ok) {
			return response.json().then(err => { throw err; });
		}
		toast_alert("Password change successful");
		errorField.classList.add('hidden');
		changePasswordForm.classList.add('hidden');
		sidebar.classList.add('hidden');
		document.removeEventListener('click', handleOutsideClick);
	})
	.catch(error => {
		toast_alert("Password not changed successful");
		errorField.textContent = error.message || "An error occurred. Please try again.";
		errorField.classList.remove('hidden');
	});
}

function updateFileName(input) {
	const fileName = document.getElementById("fileName");
	if (input.files.length > 0) {
		fileName.textContent = input.files[0].name;
	} else {
		fileName.textContent = "No file chosen";
	}
}

// GAME HISTORY TABLE

function	fillInfos() {
	populateUserDropdown()
	fillGame()
}

function fillGame() {
	const tableBody = document.getElementById('gameHistoryTableBody');
	
	tableBody.innerHTML = '';

	Promise.all([
		getGames('Pongy', window.user.blockchain_id),
		getGames('Fighty', window.user.blockchain_id)
	])
	.then(([pongy_games, fighty_games]) => {
		const games_dict = { ...pongy_games, ...fighty_games };

		if (Object.keys(games_dict).length > 0) {
			const timestamps = Object.keys(games_dict).sort((a, b) => a - b);
			tableBody.innerHTML = '';

			for (const timestamp of timestamps) {
				const { game_type, player1, player2, score1, score2, tournament_id } = games_dict[timestamp];
				const date = new Date(timestamp).toLocaleString();
				const result = '';

				if (window.user.username === player1 || window.user.username === player2) {
					if (score1 > score2 && player1 === window.user.username) {
						result = 'Win';
						window.scores.wins = window.scores.wins + 1;
					} else if (score1 < score2 && player2 === window.user.username) {
						result = 'Win';
						window.scores.wins = window.scores.wins + 1;
					} else {
						window.scores.losses = window.scores.losses + 1;
						result = 'Loss';
					}
				} else {
					result = 'N/A';
				}

				const game_name = '';

				if (tournament_id != -1) {
					game_name = game_type + ' Tournament' + tournament_id;
				}	else {
					game_name = game_type;
				}

				const newRow = document.createElement("tr");
				newRow.innerHTML = `
					<td>${game_name}</td>
					<td>${date}</td>
					<td>${player1}</td>
					<td>${player2}</td>
					<td>${score1}</td>
					<td>${score2}</td>
					<td>${result}</td>
				`;

				tableBody.appendChild(newRow);
			}
		} else {
			const noDataRow = document.createElement("tr");
			noDataRow.innerHTML = '<td colspan="7" class="text-center">No data available.</td>';
			tableBody.appendChild(noDataRow);
			window.scores.wins = 0;
			window.scores.losses = 0;
		}
		fillWinLoss()
	})
	.catch(error => {
		console.error("Error fetching games:", error.message || "An unknown error occurred");
	});
}

function getGames(gameType, instance) {
	const url = `https://${window.IP}:3000/solidity/solidity/getgames/${instance}/${gameType}`;
	return fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
	.then(response => {
		if (!response.ok) {
			throw new Error(`Failed to fetch ${gameType} games: ${response.statusText}`);
		}
		return response.json();
	})
	.then(data => {
		const matchDictionary = {};
		data.success.forEach(game => {
			const { timestamp, player1, player2, score1, score2, tournament_id } = game;
			matchDictionary[timestamp] = {
				gameType,
				player1,
				player2,
				score1,
				score2,
				tournament_id
			};
		});

		const sortedKeys = Object.keys(matchDictionary).sort((a, b) => a - b);
		const sortedMatchDictionary = {};
		sortedKeys.forEach(key => {
			sortedMatchDictionary[key] = matchDictionary[key];
		});

		return sortedMatchDictionary;
	})
	.catch(error => {
		console.error(`Error fetching ${gameType} games:`, error.message);
		return {};
	});
}

function fillWinLoss() {
	const winCounter = document.getElementById('winCounter')
	const lossCounter = document.getElementById('lossCounter')

	winCounter.textContent = window.scores.wins;
	lossCounter.textContent = window.scores.losses;
}

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

function addPongyGameInvite(data) {
	const tableBody = document.getElementById("notificationsTableBody");
	const newRow = document.createElement("tr");
	
	notificationText = "TEST"
	newRow.innerHTML = `
		<td>
			<div class="notification-row">
				<span>${notificationText}</span>
				<div>
					<button class="btn btn-success btn-sm ms-2" onclick="acceptPongyGameInvite(this)">Accept</button>
					<button class="btn btn-danger btn-sm" onclick="declinePongyGameInvite(this)">Decline</button>
				</div>
			</div>
		</td>
	`;
	
	tableBody.insertBefore(newRow, tableBody.firstChild);
}

function acceptPongyGameInvite(button) {
	const buttons = button.parentElement.querySelectorAll('button');
	buttons.forEach(btn => btn.remove());
	alert("Notification accepted!");
	// todo: Add further logic for accepting the notification
}

function declinePongyGameInvite(button) {
	const buttons = button.parentElement.querySelectorAll('button');
	buttons.forEach(btn => btn.remove());
	alert("Notification declined!");
	// todo: Add further logic for declining the notification
}

function addFightyGameInvite(data, hfsagfhag) {
	const tableBody = document.getElementById("notificationsTableBody");
	const newRow = document.createElement("tr");
	
	notificationText = "TEST"
	newRow.innerHTML = `
		<td>
			<div class="notification-row">
				<span>${notificationText}</span>
				<div>
					<button class="btn btn-success btn-sm ms-2" onclick="acceptFightyGameInvite(this, ${hfsagfhag})">Accept</button>
					<button class="btn btn-danger btn-sm" onclick="declineFightyGameInvite(this)">Decline</button>
				</div>
			</div>
		</td>
	`;
	
	tableBody.insertBefore(newRow, tableBody.firstChild);
}

async function acceptFightyGameInvite(button) {
	const buttons = button.parentElement.querySelectorAll('button');
	buttons.forEach(btn => btn.remove());
	alert("Notification accepted!");
	// todo: Add further logic for accepting the notification
}

function declineFightyGameInvite(button) {
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

//match history
function populateUserDropdown() {
	const userSelect = document.getElementById("userSelect");

	userSelect.innerHTML = '';
	
	const currentUserOption = document.createElement("option");
	currentUserOption.value = window.user.username;
	currentUserOption.textContent = window.user.username; // Display the current user's username
	userSelect.appendChild(currentUserOption);

	for (const username in window.user.friend_list) {
		const option = document.createElement("option");
		option.value = username;
		option.textContent = username;
		userSelect.appendChild(option);
	}
}

async function updateContent(selectedUser) {
	const gameHistoryTableBody = document.getElementById("gameHistoryTableBody");
	gameHistoryTableBody.innerHTML = '';

	const selectedUserInfo = await get_user_info(selectedUser);

	Promise.all([
		getGames('Pongy', selectedUserInfo.blockchain_id),
		getGames('Fighty', selectedUserInfo.blockchain_id)
	])
	.then(([pongy_games, fighty_games]) => {
		const games_dict = { ...pongy_games, ...fighty_games };

		if (Object.keys(games_dict).length > 0) {
			const timestamps = Object.keys(games_dict).sort((a, b) => a - b);
			tableBody.innerHTML = '';

			for (const timestamp of timestamps) {
				const { game_type, player1, player2, score1, score2, tournament_id } = games_dict[timestamp];
				const date = new Date(timestamp).toLocaleString();
				const result = '';

				if (window.user.username === player1 || window.user.username === player2) {
					if (score1 > score2 && player1 === window.user.username) {
						result = 'Win';
					} else if (score1 < score2 && player2 === window.user.username) {
						result = 'Win';
					} else {
						result = 'Loss';
					}
				} else {
					result = 'N/A';
				}

				const game_name = '';

				if (tournament_id != -1) {
					game_name = game_type + ' Tournament' + tournament_id;
				}	else {
					game_name = game_type;
				}

				const newRow = document.createElement("tr");
				newRow.innerHTML = `
					<td>${game_name}</td>
					<td>${date}</td>
					<td>${player1}</td>
					<td>${player2}</td>
					<td>${score1}</td>
					<td>${score2}</td>
					<td>${result}</td>
				`;

				tableBody.appendChild(newRow);
			}
		} else {
			const noDataRow = document.createElement("tr");
			noDataRow.innerHTML = '<td colspan="7" class="text-center">No data available.</td>';
			gameHistoryTableBody.appendChild(noDataRow);
			window.scores.wins = 0;
			window.scores.losses = 0;
		}
		fillWinLoss()
	})
	.catch(error => {
		console.error("Error fetching games:", error.message || "An unknown error occurred");
	});
}