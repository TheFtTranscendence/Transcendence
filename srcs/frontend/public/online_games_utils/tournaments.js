class Tournament	{

	constructor(game_name, number_of_players, host, player_list, player_info=null) {
		url = 'http://localhost:8004/tournaments/'

		data =	{
			game_name: game_name,
			number_of_players: number_of_players,
			host: host,
			player_list: player_list
		}

		
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		.then((response) => {
			this.id = 
		})
		.catch((error) => {
			return false;
		});
	}

}