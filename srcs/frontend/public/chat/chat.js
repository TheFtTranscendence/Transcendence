function chat_hashchange(event) {
	document.getElementById("chat").classList.add("hidden");
	UnloadScripts(window.chatScripts);
}

function toggleFriendList() {
	var friendDiv = document.getElementById("chat-friend-div");
	var chatMessagesTop = document.getElementById("chat-right-top");
	var chatMessagesBottom = document.getElementById("chat-right-bottom");

	if (friendDiv.style.display === "block") {
		friendDiv.style.display = "none";
		chatMessagesTop.style.display = "block";
		chatMessagesBottom.style.display = "block";
	} else {
		friendDiv.style.display = "block";
		chatMessagesTop.style.display = "none";
		chatMessagesBottom.style.display = "none";
	}
}

function chat()
{

	document.getElementById("chat").classList.remove("hidden");
	
	window.addEventListener('hashchange', chat_hashchange);
}