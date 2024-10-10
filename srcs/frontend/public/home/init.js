function home_hashchange(event)
{

	document.getElementById('home').classList.add('hidden');
	unloadScripts(window.homeScripts);
	if (window.frontendHealthCheck === false) 
	{
		checkTournamentStatus()
		window.frontendHealthCheck = true
	}
}

function home()
{
	getAvatar()
	document.getElementById('home').classList.remove('hidden');
	window.addEventListener('hashchange', home_hashchange);
	document.getElementById('profile-img').addEventListener('click', showSideBar);
}

async function checkTournamentStatus()
{
	console.log("HERE CHECKING TOURNEY DATABASE")
	let pongyStatus = false
	let url = `https://${window.IP}:3000/solidity/solidity/gettournamentstatus/${window.user.blockchain_id}/Pongy`;
	
	try {
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
		pongyStatus = data.success;

		console.log('INITIAL PONGY STATUS:', pongyStatus); // Log the pongyStatus
		
	} catch (error) {
		// Handle any errors
		console.error('Error:', error);
	}
	
	let fightyStatus = false
	const url2 = `https://${window.IP}:3000/solidity/solidity/gettournamentstatus/${window.user.blockchain_id}/Fighty`;

	try {
		// Use await to wait for the fetch request to complete
		const response = await fetch(url2, {
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
		fightyStatus = data.success;

		console.log('INITIAL FIGHTY STATUS:', fightyStatus); // Log the fightyStatus
		
	} catch (error) {
		// Handle any errors
		console.error('Error:', error);
	}

	if (pongyStatus)
		pongyTournamentData.retriveTournamentInfo()
	if (fightyStatus)
		fightyTournamentData.retriveTournamentInfo()

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
		alert('Please select a file to upload.');
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
		alert("Password change successful");
		errorField.classList.add('hidden');
		changePasswordForm.classList.add('hidden');
		sidebar.classList.add('hidden');
		document.removeEventListener('click', handleOutsideClick);
	})
	.catch(error => {
		alert("Password not changed successful");
		errorField.textContent = error.message || "An error occurred. Please try again.";
		errorField.classList.remove('hidden');
	});
}


