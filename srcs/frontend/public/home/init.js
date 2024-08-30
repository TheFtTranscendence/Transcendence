function home_hashchange(event)
{
	document.getElementById('home').classList.add('hidden');
	unloadScripts(window.homeScripts);
}

function home()
{
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
	axios.get('http://localhost:8000/data/avatar/' + username)
    .then((response) => {
		const imageUrl = response.data.url;
		//Check if imageUrl is working, if not show default
		const img = new Image();
		img.onload = function() {
			imgElement.src = imageUrl;
		};
		img.onerror = function() {
			imgElement.src = 'img/red.jpg';
		};
		img.src = imageUrl;

    })
    .catch((error) => {
        console.error(error);
		imgElement.src = 'img/red.jpg';
    });
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
	const imgElement = document.querySelector('#profile-img img');
	const file = event.target.files[0];
	imgElement.src = URL.createObjectURL(file);
	sidebar.classList.add('hidden');
	document.removeEventListener('click', handleOutsideClick);

	username = "window.user.username" //ToDO: Get real username
	const formData = new FormData();
	formData.append('avatar', file);

	axios.put('http://localhost:8000/config/change_avatar/' + username, formData)
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
	document.querySelector('nav').classList.add('hidden');
	sidebar.classList.add('hidden');
	document.removeEventListener('click', handleOutsideClick);
	window.location.hash = '#auth';
}

// CHANGE PASSWORD
document.getElementById('changePassword').addEventListener('click', handlePasswordChange);

function handlePasswordChange() {
	const changePasswordForm = document.getElementById('changePasswordForm')
	if (changePasswordForm) { // Check if the element exists
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
	const currentPassword = document.getElementById('currentPassword').value;
	const newPassword = document.getElementById('newPassword').value;
	const confirmNewPassword = document.getElementById('confirmNewPassword').value;
	const errorField = document.getElementById('changePasswordError')

	const data = {
		old_password: currentPassword,
		new_password: newPassword,
		confirm_new_password: confirmNewPassword
	}

	axios.put('http://localhost:8000/config/change_avatar/' + username, data)
	.then(response => {
		alert("Password change successful");
		if (!errorField.classList.contains('hidden')) {
			errorField.classList.add('hidden');
		}
	})
	.catch(error => {
		errorField.textContent = error;
		errorField.classList.remove('hidden');
	});
}

