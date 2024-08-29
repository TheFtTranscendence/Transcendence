function home_hashchange(event)
{
	document.getElementById('home').classList.add('hidden');
	unloadScripts(window.homeScripts);
}

function home()
{
	console.log("home() called")
	getAvater("window.user.username") //ToDo: Create currentUser or similar instance
	document.getElementById('home').classList.remove('hidden');
	window.addEventListener('hashchange', home_hashchange);
	document.getElementById('profile-img').addEventListener('click', showSideBar);
}

function handleLogout() {
	document.querySelector('nav').classList.add('hidden');
	sidebar.classList.add('hidden');
	document.removeEventListener('click', handleOutsideClick);
	window.location.hash = '#auth';
}

function getAvater(username) {
	const imgElement = document.querySelector('#profile-img img');
	axios.get('http://localhost:8000/data/avatar/' + username)
    .then((response) => {
		const imageUrl = response.data.url;
		imgElement.src = imageUrl;
		// TODO: Check if imnageUrl is working and show default if not
    })
    .catch((error) => {
        console.error(error);
		imgElement.src = 'img/red.jpg';
    });
	document.getElementById('profile-img').classList.remove('hidden');
}

function showSideBar() {
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
        console.log("Clicked outside, hiding sidebar");
        sidebar.classList.add('hidden');
        document.removeEventListener('click', handleOutsideClick);
    } else {
        console.log("Clicked inside sidebar or profile image");
    }
}

// Function to handle profile update
function handleProfileUpdate() {
	alert('Updating profile...');
	// ToDo
}

function putAvater() {
	var loadFile = function(event) {
		var image = document.querySelector('#profile-img img');
		image.src = URL.createObjectURL(event.target.files[0]);
	};
}

document.getElementById('logoutButton').addEventListener('click', handleLogout);

document.getElementById('changeProfilePicture').addEventListener('change', putAvater);

