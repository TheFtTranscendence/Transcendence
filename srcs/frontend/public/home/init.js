function home_hashchange(event)
{
	document.getElementById('home').classList.add('hidden');
	UnloadScripts(window.homeScripts);
}

function home()
{
	document.getElementById('home').classList.remove('hidden');
	
	window.addEventListener('hashchange', home_hashchange);
	
}