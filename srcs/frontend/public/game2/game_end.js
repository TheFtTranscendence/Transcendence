function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function game_end(v) {
	clearInterval(v.g.gameInterval);
    clearInterval(v.g.timerInterval);

	window.removeEventListener('keydown', game2_keydown)
	window.removeEventListener('keyup', game2_keyup)

	
	if (v.player.health > v.enemy.health)
		game_end_winner(v, v.player, v.enemy)
	else if (v.player.health < v.enemy.health)
		game_end_winner(v, v.enemy, v.player)
	else
		game_end_tie(v)
}

async function game_end_winner(v, winner, loser) {

	if (winner.facing == 'right')
		winner.framesCurrent = winner.hit_frame
	else
		winner.framesCurrent = winner.hit_frameInv
	
	
	v.g.c.fillStyle = 'black'; v.g.c.fillRect(0, 0, v.g.canvas.width, v.g.canvas.height)
	
	v.background.update_frame(v.g.c)
	v.shop.update_frame(v.g.c)
	v.player.draw(v.g.c)
	v.enemy.draw(v.g.c)
	console.log('Players drawn')
	await sleep(1000)

	// if (winner.attacking == true) {

		while (loser.framesCurrent < loser.framesMax - 1) {
			
			v.g.c.fillStyle = 'black'; v.g.c.fillRect(0, 0, v.g.canvas.width, v.g.canvas.height)
			
			v.background.update_frame(v.g.c)
			v.shop.update_frame(v.g.c)
			v.player.update_frame(v.g.c)
			v.enemy.update_frame(v.g.c)
			
			await sleep(1000)
		}
	// }
		
	v.player.velocity.x = 0;
	v.enemy.velocity.x = 0;
	reset_keys(v)

	update_keys2(v, v.player, v.keys.d.pressed, v.keys.a.pressed, v.keys.w.pressed, 'd', 'a')
	update_keys2(v, v.enemy, v.keys.ArrowRight.pressed, v.keys.ArrowLeft.pressed, v.keys.ArrowUp.pressed, 'ArrowRight', 'ArrowLeft')
	
	winner.framesCurrent = winner.framesMax

	if (loser.facing == 'right')
		loser.change_sprites(loser.sprites.death)
	else
		loser.change_sprites(loser.sprites.deathInv)
	
	if (winner.facing == 'right')
		winner.change_sprites(winner.sprites.idle)
	else 
		winner.change_sprites(winner.sprites.idleInv)

	v.g.backgroundInterval = setInterval(() => {
		v.g.c.fillStyle = 'black'; v.g.c.fillRect(0, 0, v.g.canvas.width, v.g.canvas.height)
		v.background.update(v.g)
		v.shop.update(v.g)
		winner.update(v.g)
		loser.death_update(v.g)

		// update_keys2(v, v.player, v.keys.d.pressed, v.keys.a.pressed, v.keys.w.pressed, 'd', 'a')
		// update_keys2(v, v.enemy, v.keys.ArrowRight.pressed, v.keys.ArrowLeft.pressed, v.keys.ArrowUp.pressed, 'ArrowRight', 'ArrowLeft')
		
	}, 1000 / v.g.fps)
	
	console.log('Game ending sequence ended')

	document.querySelector('#game2-end-text').innerHTML = winner.name + ' wins!'
	document.querySelector('#game2-end-text').style.display = 'flex'


	// Reset variables!
	// Do we really?
	// YES!!!
	// Not going global!

	// leave_game(v)

	axios.post('http://localhost:8001/solidity/addgame/' + window.user.smartcontract_id, {
		player1: v.player.name,
		player2: v.enemy.name,
		score1: v.player.health,
		score2: v.enemy.health
	})
	
	console.log('Game Ended!')
}

async function game_end_tie(v) {
	
	await sleep(1000)
	
	if (v.player.position.x > v.enemy.position.x)
	{
		v.player.change_sprites(v.player.sprites.idleInv)
		v.enemy.change_sprites(v.enemy.sprites.idle)

	}
	else {
		v.player.change_sprites(v.player.sprites.idle)
		v.enemy.change_sprites(v.enemy.sprites.idleInv)
	}

	
	v.player.velocity.x = 0;
	v.enemy.velocity.x = 0;
	reset_keys(v)
	
	v.g.backgroundInterval = setInterval(() => {
		v.g.c.fillStyle = 'black'; v.g.c.fillRect(0, 0, v.g.canvas.width, v.g.canvas.height)
		v.background.update(v.g)
		v.shop.update(v.g)
		v.player.update(v.g)
		v.enemy.update(v.g)
	}
	, 1000 / v.g.fps)
	
	document.querySelector('#game2-end-text').innerHTML = 'Tie!'
	document.querySelector('#game2-end-text').style.display = 'flex'

	axios.post('http://localhost:8001/solidity/addgame/' + window.user.smartcontract_id, {
		player1: v.player.name,
		player2: v.enemy.name,
		score1: v.player.health,
		score2: v.enemy.health
	})

	leave_game(v)
	
}

