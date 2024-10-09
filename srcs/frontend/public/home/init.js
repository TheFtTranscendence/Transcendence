function home_hashchange(event)
{
	document.getElementById('home').classList.add('hidden');
	unloadScripts(window.homeScripts);
}

function home()
{
	console.log("home called")
	getAvater("window.user.username") //ToDo: Create currentUser or similar instance
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
function getAvater(username) {
	const imgElement = document.querySelector('#profile-img img');

	if (window.user && window.user.avater) {
		imgElement.src = window.user.avater;
	} else {
		imgElement.src = 'img/red.jpg';
	}
	document.getElementById('profile-img').classList.remove('hidden');
}

// CHANGE PROFILE PICTURE
document.getElementById('uploadButton').addEventListener('click', triggerFileDialog);
document.getElementById('changeProfilePicture').addEventListener('change', putAvatar);


function triggerFileDialog() {
	document.getElementById('changeProfilePicture').click();
}

// Function to handle image selection and preview
function putAvatar(event) {
	const sidebar = document.getElementById('sidebar');
	const imgElement = document.querySelector('#profile-img img');
	const file = event.target.files[0];
	imgElement.src = URL.createObjectURL(file);
	sidebar.classList.add('hidden');
	document.removeEventListener('click', handleOutsideClick);

	username = "window.user.username" //ToDO: Get real username
	const formData = new FormData();
	formData.append('avatar', file);

	userheaders = {
		'Authorization': 'Token ' + window.Usertoken,
		'Content-Type': 'multipart/form-data',
	}

	axios.patch('http://' + window.IP + ':8000/auth/users/' + window.user.id + '/', formData)
    .then(response => {
		console.log('Upload successful:', response.data);
	})
	.catch(error => {
		console.error('Error uploading file:', error);
	});
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
	const changePasswordForm = document.getElementById('changePasswordForm')
	if (changePasswordForm) {
        if (changePasswordForm.classList.contains('hidden')) {
            console.log("remove hidden");
            changePasswordForm.classList.remove('hidden');
            document.getElementById('submitPasswordChange').addEventListener('click', handlePasswordChangeForm);
        } else {
            console.log("add hidden");
            changePasswordForm.classList.add('hidden');
            document.getElementById('submitPasswordChange').removeEventListener('click', handlePasswordChangeForm);
        }
    } else {
        console.error('Element #changePasswordForm not found');
    }
}

function handlePasswordChangeForm() {
	event.preventDefault();
	const currentPassword = document.getElementById('currentPassword').value;
	const newPassword = document.getElementById('newPassword').value;
	const confirmNewPassword = document.getElementById('confirmNewPassword').value;
	const errorField = document.getElementById('changePasswordError')
	const changePasswordForm = document.getElementById('changePasswordForm')
	const sidebar = document.getElementById('sidebar');
	const username = "window.user.username" //ToDo: get real username

	const data = {
		old_password: currentPassword,
		new_password: newPassword,
		confirm_new_password: confirmNewPassword
	}

	axios.put('http://' + window.IP + ':8000/config/change_avatar/' + username, data)
	.then(response => {
		alert("Password change successful");
		if (!errorField.classList.contains('hidden')) {
			errorField.classList.add('hidden');
		}
		changePasswordForm.classList.add('hidden');
		document.getElementById('submitPasswordChange').removeEventListener('click', handlePasswordChangeForm);
		sidebar.classList.add('hidden');
		document.removeEventListener('click', handleOutsideClick);
	})
	.catch(error => {
		errorField.textContent = error;
		errorField.classList.remove('hidden');
	});
}


//! We should still put this inside a try but it should never happen
function	update_user_info() {
	userheaders = {
		'Authorization': 'Token ' + window.user.token,
	}

	axios.get(`http://${window.IP}:8000/auth/users/`, {headers: userheaders})
	.then((response) => {
		window.user = response.data;
		_update_user_chats()
	})
	.catch((error) => {
		if (error.response && error.response.data) {
			throw error.response.data;
		} else {
			throw new Error("An unknown error occurred");
		}
	})
}

//! This really needs to be inside a try because if the target user doesnt exist its going to raise an exception
//this works with both username and user ID
function	get_user_info(target) {
	userheaders = {
		'Authorization': 'Token ' + window.user.token,
	}

	axios.get(`http://${window.IP}:8000/auth/users/${target}/`, {headers: userheaders})
	.then((response) => {
		return response.data
	})
	.catch((error) => {
		if (error.response && error.response.data) {
			throw error.response.data;
		} else {
			throw new Error("An unknown error occurred");
		}
	})
}

/*
	*This is only needed as an admin on the console
	*I dont think there is a need for the user to be able to delete his account
*/
//if no user is provided it will delete himself
function	delete_user(target = '') {
	if (target == '')	{
		url = `http://${window.IP}:8000/auth/users/`
	} else {
		url = `http://${window.IP}:8000/auth/users/${target}`
	}

	userheaders = {
		'Authorization': 'Token ' + window.user.token,
	}

	axios.delete(url, {headers: userheaders})
	.then((response) => {
		return response.data
	})
	.catch((error) => {
		if (error.response && error.response.data) {
			throw error.response.data;
		} else {
			throw new Error("An unknown error occurred");
		}
	})
}

//* The target part should only be used as an admin in the console, so once again, dont worry about it
function	modify_user(field, new_value, target='') {
	url = `http://${window.IP}:8000/auth/users/${target}`

	data = {
		[field]: new_value
	}

	userheaders = {
		'Authorization': 'Token ' + window.user.token,
	}

	axios.patch(url, {headers: userheaders}, data)
	.then((response) => {
		return response.data
	})
	.catch((error) => {
		if (error.response && error.response.data) {
			throw error.response.data;
		} else {
			throw new Error("An unknown error occurred");
		}
	})
}
