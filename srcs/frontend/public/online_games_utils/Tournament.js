class Tournament2 {

	constructor(game_name = null, number_of_players = null, host = null, player_list = null, player_info=null, tournament_id = null) {
		if (!tournament_id)
		{
			const url = 'https://' + window.IP + ':3000/online-games/tournaments/';

			const data = {
				game_name: game_name,
				number_of_players: number_of_players,
				host: host,
				player_list: player_list,
				player_info: player_info
			};
			
			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})
			.then(response => {
				return response.json();
			})
			.then((data) => {
				this.id = data.id;
				this.game_name = data.game_name;
				this.number_of_players = data.number_of_players;
				this.host = data.host;
				this.player_list = data.player_list;
				this.games = data.tournament_games;
				this.player_info = data.player_info;
				this.status = data.status;
			})
			.catch((error) => {
				throw new Error(error.message);
			});
			
		}	else	{

			const url = 'https://' + window.IP + ':3000/online-games/tournaments/' + tournament_id + '/';
			
			fetch(url, {
				method: 'GET'
			})
			.then(response => {
				return response.json();
			})
			.then((data) => {
				this.id = data.id;
				this.game_name = data.game_name;
				this.number_of_players = data.number_of_players;
				this.host = data.host;
				this.player_list = data.player_list;
				this.games = data.tournament_games;
				this.player_info = data.player_info;
				this.status = data.status;
			})
			.catch((error) => {
				throw new Error(error.message);
			});
		}
	}

	// async #fetchWinners() {
	// 	const url = 'https://' + window.IP + ':3000/online-games/tournaments/' + this.id + '/winners/';

	// 	return fetch(url, {
	// 		method: 'GET',
	// 	})
	// 	.then(response => {
	// 		if (!response.ok) {
	// 			return response.json().then(err => { throw err; });
	// 		}
	// 		return response.json();
	// 	})
	// 	.then(data => {
	// 		return data.winners;
	// 	})
	// 	.catch(error => {
	// 		throw new Error(error.message);
	// 	});
	// }

	get winners() {
		const winners = []

		this.games.forEach(game => {
			const maxScoreIndex = game.scores.indexOf(Math.max(...game.scores));
			winners.push(game.users[maxScoreIndex]);
		});

		return winners;
	}

	get games_done ()	{
		return (length(this.winners))
	}

	get next_players() {
		if (this.games_done <= this.number_of_players / 2)	{
			return ([
				this.player_list[(this.games_done - this.number_of_players / 2) * 2],
				this.player_list[((this.games_done - this.number_of_players / 2) * 2) - 1]
			]);
		}	else	{
			const winners = this.winners;
			return ([
				winners[(this.games_done - this.number_of_players / 2) * 2],
				winners[((this.games_done - this.number_of_players / 2) * 2) - 1]
			]);
		}
	}

	async post(game) {
		const url = `https://' + window.IP + ':3000/online-games/tournaments/${this.id}/games/`;

		return fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(game),
		})
		.then(response => {
			if (!response.ok) {
				return response.json().then(err => { throw err; });
			}
			return response.json();
		})
		.then(data => {
			this.games.push(data.data);
			return data.status;
		})
		.catch(error => {
			throw new Error(error.message);
		});
	}

	async abort() {
		//todo
	}
}

async function inTournament(game)	{
	const url = 'https://' + window.IP + ':3000/online-games/tournaments/my_tournament/' + window.user.id + '/' + game + '/';

		return fetch(url, {
			method: 'GET',
		})
		.then(response => {
			if (!response.ok) {
				return response.json().then(err => { throw err; });
			}
			return response.json();
		})
		.then(data => {
			return data;
		})
		.catch(error => {
			throw new Error(error.message);
		});
}
