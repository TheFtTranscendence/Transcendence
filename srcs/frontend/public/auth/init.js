function auth_hashchange(event)
{
	document.getElementById('auth').classList.add('hidden');
	unloadScripts(window.homeScripts);
}

function auth()
{
	document.getElementById('auth').classList.remove('hidden');
	window.addEventListener('hashchange', auth_hashchange);
}
