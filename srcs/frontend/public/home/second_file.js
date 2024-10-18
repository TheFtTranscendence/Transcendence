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
		})
		.catch(error => console.error('Error:', error));
	});
}

function handleFileUpload() {
	const avatarInput = document.getElementById('avatarInput');
	const file = avatarInput.files[0];

	if (file) {

		uploadAvatar(file).then((uploadedUrl) => {
			const profileImg = document.querySelector('#profile-img img');
			profileImg.src = uploadedUrl;
			profileImg.alt = file.name;
			update_user_in_socket();
			avatarInput.value = '';
		}).catch((error) => {
			console.error('Upload failed:', error);
			toast_alert('Failed to upload the file');
		});

	} else {
		toast_alert('You need to insert a file');
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
			resolve(data);
		})
		.catch(error => {
			reject(error);
		});
	});
}

function changeUsername() {
	const usernameInput = document.getElementById('usernameInput');
	const newUsername = usernameInput.value.trim();

	if (newUsername) {
		
		updateUsername(newUsername).then(() => {
			update_user_in_socket();
			usernameInput.value = ''
			update_user_info()
		}).catch((error) => {
			console.error('Username update failed:', error);
			toast_alert('Failed to update username');
		});

	} else {
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

	if (oldPassword && newPassword && confirmPassword) {
		if (newPassword === confirmPassword) {
			
			updatePassword(oldPassword, newPassword, confirmPassword).then(() => {
				update_user_in_socket();
				oldPasswordInput.value = ''
				newPasswordInput.value = ''
				confirmPasswordInput.value = ''
				update_user_info();
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
	} else {
		toast_alert('Please fill in all fields');
	}
}

function logout()	{
	location.reload();
}