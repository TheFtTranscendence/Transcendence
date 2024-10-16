class Tournament {

	constructor(game_name, number_of_players, host, player_list, player_info=null) {
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
			this.tournament_games = data.tournament_games;
			this.player_info = data.player_info;
			this.status = data.status;
		})
		.catch((error) => {
			throw new Error(error.message);
		});
	}

	async #fetchWinners() {
		const url = 'https://' + window.IP + ':3000/online-games/tournaments/' + this.id + '/winners/';

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
			return data.winners;
		})
		.catch(error => {
			throw new Error(error.message);
		});
	}

	get winners() {
		return (async () => {
			return await this.#fetchWinners();
		})();
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
			this.tournament_games = [...this.tournament_games, data.data];
			return data.status;
		})
		.catch(error => {
			throw new Error(error.message);
		});
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
			return data.detail;
		})
		.catch(error => {
			throw new Error(error.message);
		});
}
