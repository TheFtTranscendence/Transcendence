function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function game_end(v) {
	clearInterval(v.g.gameInterval);
    clearInterval(v.g.timerInterval);

	
	if (v.player.health > v.enemy.health) {
		loser = v.enemy
		winner = v.player
		if (v.player.facing == 'right')
			v.player.framesCurrent = v.player.hit_frame	
		else
			v.player.framesCurrent = v.player.hit_frameInv
	}
	else {
		loser = v.player
		winner = v.enemy
		if (v.enemy.facing == 'right')
			v.enemy.framesCurrent = v.enemy.hit_frame
		else
			v.enemy.framesCurrent = v.enemy.hit_frameInv
	}

	
	v.g.c.fillStyle = 'black'; v.g.c.fillRect(0, 0, v.g.canvas.width, v.g.canvas.height)
	
	v.background.update_game_end(v.g.c)
	v.shop.update_game_end(v.g.c)
	v.player.draw(v.g.c)
	v.enemy.draw(v.g.c)
	console.log('Players drawn')
	await sleep(1000)

	while (loser.framesCurrent < loser.framesMax - 1) {

		v.g.c.fillStyle = 'black'; v.g.c.fillRect(0, 0, v.g.canvas.width, v.g.canvas.height)

		v.background.update_game_end(v.g.c)
		v.shop.update_game_end(v.g.c)
		v.player.update_game_end(v.g.c)
		v.enemy.update_game_end(v.g.c)
		
		await sleep(1000)
	}

	winner.velocity.x = 0;
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
		v.background.update(v.g.fps, v.g)
		v.shop.update(v.g.fps, v.g)
		winner.update(v.g.fps, v.g)
		loser.death_update(v.g.fps, v.g)
	}, 1000 / v.g.fps)
	
	console.log('Game ending sequence ended')

	if (v.player.health > v.enemy.health)
		document.querySelector('#game2-end-text').innerHTML = 'Player 1 Wins!'
	else if (v.player.health < v.enemy.health)
		document.querySelector('#game2-end-text').innerHTML = 'Player 2 Wins!'
	else
		document.querySelector('#game2-end-text').innerHTML = 'Tie!'

	document.querySelector('#game2-end-text').style.display = 'flex'

	// Reset variables!
	// Do we really?
	// YES!!!
	// Not going global!

	leave_game(v)

	// Para registar na blockchain o jogo
	// axios.post('http://localhost:8001/solidity/addgame')
	

	
	console.log('Game Ended!')
}