function create_tournament(game_name, number_of_players, host, player_list)	{

	url = 'http://localhost:8004/tournaments/'

	

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
	.then((response) => {
			
	})
	.catch((error) => {
		
	});
}