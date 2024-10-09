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

function handleUpload() {
	const fileInput = document.getElementById('avatarInput');

	if (fileInput.files.length > 0) {
		uploadAvatar(fileInput.files[0]);
	} else {
		toast_alert('Please select a file to upload.');
	}
}

async function uploadAvatar(file) {
	const formData = new FormData();
	formData.append('avatar', file);

	try {
		const response = await fetch(`https://${window.IP}:3000/user-management/auth/users/${window.user.id}/`, {
			method: 'PATCH',
			body: formData,
			headers: {
				'Authorization': 'Token ' + window.usertoken,
			},
		});

		if (!response.ok) {
			const errorData = await response.json(); // Parse error response if available
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

// dummy data
const Game = {
	timestamp: "",
	player1: "",
	player2: "",
	score1: "",
	score2: "",
	tournamentIndex: ""    // -1: not a tournament, then the index of the tournament
}

function	fillInfos() {
	populateUserDropdown()
	fillGame()
	fillWinLoss()
}

function fillGame() {
	const table = document.getElementById('gameHistoryTableBody')
	
	//todo: ask loris get all games if possible
	const url = `https://${window.IP}:3000/solidity/solidity/getgames/${window.user.blockchain_id}/Pongy`;

	fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
	.then(response => {
		if (!response.ok) {
			return response.json().then(err => { throw err; });
		}
		return response.json();
	})
	.then(data => {
		console.log(data)
		//todo: understand how information comes, needs actual games
	})
	.catch(error => {
		throw new Error(error.message || "An unknown error occurred");
	});

	// cicly to do this for everygame in history
	// const newRow = document.createElement("tr");
	
	// newRow.innerHTML = `
	//     <td>${game}</td>
	//     <td>${date}</td>
	//     <td>${player1}</td>
	//     <td>${player2}</td>
	//     <td>${score1}</td>
	//     <td>${score2}</td>
	//     <td>${result}</td>
	// `;
	
	// tableBody.appendChild(newRow);
}


function fillWinLoss() {
	const winCounter = document.getElementById('winCounter')
	const lossCounter = document.getElementById('lossCounter')

	//todo:
	winCounter.textContent = 5
	lossCounter.textContent = 6
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
	// Add further logic for accepting the notification
}

function declinePongyGameInvite(button) {
	const buttons = button.parentElement.querySelectorAll('button');
	buttons.forEach(btn => btn.remove());
	alert("Notification declined!");
	// Add further logic for declining the notification
}

function addFightyGameInvite(data) {
	const tableBody = document.getElementById("notificationsTableBody");
	const newRow = document.createElement("tr");
	
	notificationText = "TEST"
	newRow.innerHTML = `
		<td>
			<div class="notification-row">
				<span>${notificationText}</span>
				<div>
					<button class="btn btn-success btn-sm ms-2" onclick="acceptFightyGameInvite(this)">Accept</button>
					<button class="btn btn-danger btn-sm" onclick="declineFightyGameInvite(this)">Decline</button>
				</div>
			</div>
		</td>
	`;
	
	tableBody.insertBefore(newRow, tableBody.firstChild);
}

function acceptFightyGameInvite(button) {
	const buttons = button.parentElement.querySelectorAll('button');
	buttons.forEach(btn => btn.remove());
	alert("Notification accepted!");
	// Add further logic for accepting the notification
}

function declineFightyGameInvite(button) {
	const buttons = button.parentElement.querySelectorAll('button');
	buttons.forEach(btn => btn.remove());
	alert("Notification declined!");
	// Add further logic for declining the notification
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

function updateContent(selectedUser) {
    const gameHistoryTableBody = document.getElementById("gameHistoryTableBody");
    gameHistoryTableBody.innerHTML = ''; // Clear previous content

    // Sample data, replace with actual game data from the user object
    const sampleData = {
        user1: [
            { game: "Game A", date: "2023-10-01", player1: "User 1", player2: "User 2", score1: 3, score2: 1, result: "Win" },
            { game: "Game B", date: "2023-10-05", player1: "User 1", player2: "User 3", score1: 2, score2: 3, result: "Loss" }
        ],
        user2: [
            { game: "Pongy", date: "2024-10-11", player1: "user2", player2: "admin", score1: 3, score2: 5, result: "Loss" },
            { game: "Fighty", date: "2024-10-11", player1: "admin", player2: "user2", score1: 1, score2: 0, result: "Loss" },
            { game: "Fighty", date: "2024-10-11", player1: "admin", player2: "user2", score1: 0, score2: 1, result: "Win" },
            { game: "Fighty", date: "2024-10-11", player1: "user2", player2: "admin", score1: 0, score2: 1, result: "Loss" }
        ],
        user3: [
            { game: "Game D", date: "2023-10-03", player1: "User 3", player2: "User 1", score1: 5, score2: 0, result: "Win" }
        ]
    };

    if (selectedUser && sampleData[selectedUser]) {
        sampleData[selectedUser].forEach(row => {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${row.game}</td>
                <td>${row.date}</td>
                <td>${row.player1}</td>
                <td>${row.player2}</td>
                <td>${row.score1}</td>
                <td>${row.score2}</td>
                <td>${row.result}</td>
            `;
            gameHistoryTableBody.appendChild(newRow);
        });
    } else {
        const noDataRow = document.createElement("tr");
        noDataRow.innerHTML = '<td colspan="7" class="text-center">No data available.</td>';
        gameHistoryTableBody.appendChild(noDataRow);
    }
}