function uploadAvatar(file) {
	return new Promise((resolve, reject) => {

		const formData = new FormData();
		formData.append('avatar', document.getElementById('avatarInput').files[0]);
	
		fetch(`https://${window.IP}:3000/user-management/auth/users/${window.user.id}/`, {
			method: 'PATCH',
			body: formData,
			headers: {
				'Authorization': 'Token ' + window.usertoken,
			},
		})
		.then(response => response.json())
		.then(data => {
			window.user = data.user;
			getAvatar()
			update_user_in_socket();
		})
		.catch(error => console.error('Error:', error));
	});
}

function handleFileUpload() {
	const avatarInput = document.getElementById('avatarInput');
	const file = avatarInput.files[0];

	if (file && file.type === 'image/jpeg') {

		uploadAvatar(file).then((uploadedUrl) => {
			const profileImg = document.querySelector('#profile-img img');
			profileImg.src = uploadedUrl;
			profileImg.alt = file.name;
			avatarInput.value = '';
		}).catch((error) => {
			console.error('Upload failed:', error);
			toast_alert('Failed to upload the file');
		});

	} else {
		toast_alert('You need to insert a jpg file');
	}
}

function updateUsername(username) {
	return new Promise((resolve, reject) => {
		const data = {
			username: username,
		}
	
		fetch(`https://${window.IP}:3000/user-management/auth/users/${window.user.id}/`, {
			method: 'PATCH',
			body: JSON.stringify(data),
			headers: {
				'Authorization': 'Token ' + window.usertoken,
				'Content-Type': 'application/json',
			},
		})
		.then(data => {
			update_user_in_socket();
			update_user_info()
			resolve(data);
		})
		.catch(error => {
			reject(error);
		});
	});
}

function isAlphanumeric(str) {
	return /^[a-z0-9]+$/i.test(str);
}

function changeUsername() {
	const usernameInput = document.getElementById('usernameInput');
	const newUsername = usernameInput.value.trim();

	if (newUsername && isAlphanumeric(newUsername)) {

		updateUsername(newUsername).then(() => {
			usernameInput.value = ''
		}).catch((error) => {
			console.error('Username update failed:', error);
			toast_alert('Failed to update username');
		});

	} else if (!isAlphanumeric(newUsername)) {
		toast_alert('Username must be alphanumeric')
	} else  {
		toast_alert('Please enter a username');
	}
}

function updatePassword(oldPassword, newPassword, confirmPassword) {
	return new Promise((resolve, reject) => {
		const data = {
			old_password: oldPassword,
			password: newPassword,
			confirm_password: confirmPassword
		}
	
		fetch(`https://${window.IP}:3000/user-management/auth/users/${window.user.id}/`, {
			method: 'PATCH',
			body: JSON.stringify(data),
			headers: {
				'Authorization': 'Token ' + window.usertoken,
				'Content-Type': 'application/json',
			},
		})
		.then(data => {
			resolve(data);
		})
		.catch(error => {
			update_user_in_socket();
			update_user_info();
			reject(error);
		});
	});
}

function changePassword() {
	const oldPasswordInput = document.getElementById('oldPasswordInput');
	const newPasswordInput = document.getElementById('newPasswordInput');
	const confirmPasswordInput = document.getElementById('confirmPasswordInput');

	const oldPassword = oldPasswordInput.value.trim();
	const newPassword = newPasswordInput.value.trim();
	const confirmPassword = confirmPasswordInput.value.trim();

	if (oldPassword && newPassword && confirmPassword && isAlphanumeric(newPassword)) {
		if (newPassword === confirmPassword) {
			
			updatePassword(oldPassword, newPassword, confirmPassword).then(() => {
				oldPasswordInput.value = ''
				newPasswordInput.value = ''
				confirmPasswordInput.value = ''
			}).catch((error) => {
				//todo: on backend password error should return an error
				console.error('Password update failed:', error);
				toast_alert('Failed to update password');
				oldPasswordInput.value = ''
				newPasswordInput.value = ''
				confirmPasswordInput.value = ''
				getAvatar()
			});

		} else {
			toast_alert('New passwords do not match');
		}
	} else if (!isAlphanumeric(newPassword)) {
		toast_alert('Passwords must be alphanumeric')
	} else	{
		toast_alert('Please fill in all fields');
	}
}

function logout()	{
	window.user = null
	document.getElementById("navigation-bar").classList.add("hidden");
	location.reload();
}