function Matchmaking_sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function Matchmaking_game_end(v) {
	clearInterval(v.g.gameInterval);
    clearInterval(v.g.timerInterval);
	clearInterval(v.s.socketupdate)

	window.removeEventListener('keydown', Matchmaking_game2_keydown)
	window.removeEventListener('keyup', Matchmaking_game2_keyup)

	
	if (v.player.health > v.enemy.health)
		Matchmaking_game_end_winner(v, v.player, v.enemy)
	else if (v.player.health < v.enemy.health)
		Matchmaking_game_end_winner(v, v.enemy, v.player)
	else
		Matchmaking_game_end_tie(v)
}

async function Matchmaking_game_end_winner(v, winner, loser) {

	if (winner.facing == 'right')
		winner.framesCurrent = winner.hit_frame
	else
		winner.framesCurrent = winner.hit_frameInv
	
	
	v.g.c.fillStyle = 'black'; v.g.c.fillRect(0, 0, v.g.canvas.width, v.g.canvas.height)
	
	v.background.update_frame(v.g.c)
	v.shop.update_frame(v.g.c)
	v.player.draw(v.g.c)
	v.enemy.draw(v.g.c)
	await Matchmaking_sleep(1000)

	// if (winner.attacking == true) {

		while (loser.framesCurrent < loser.framesMax - 1) {
			
			v.g.c.fillStyle = 'black'; v.g.c.fillRect(0, 0, v.g.canvas.width, v.g.canvas.height)
			
			v.background.update_frame(v.g.c)
			v.shop.update_frame(v.g.c)
			v.player.update_frame(v.g.c)
			v.enemy.update_frame(v.g.c)
			
			await Matchmaking_sleep(1000)
		}
	// }
		
	v.player.velocity.x = 0;
	v.enemy.velocity.x = 0;
	Matchmaking_reset_keys(v)

	Matchmaking_update_keys2(v, v.player, v.keys.d.pressed, v.keys.a.pressed, v.keys.w.pressed, 'd', 'a')
	Matchmaking_update_keys2(v, v.enemy, v.keys.ArrowRight.pressed, v.keys.ArrowLeft.pressed, v.keys.ArrowUp.pressed, 'ArrowRight', 'ArrowLeft')
	
	winner.framesCurrent = winner.framesMax

	if (loser.facing == 'right')
		loser.change_sprites(loser.sprites.death)
	else
		loser.change_sprites(loser.sprites.deathInv)
	
	if (winner.facing == 'right')
		winner.change_sprites(winner.sprites.idle)
	else 
		winner.change_sprites(winner.sprites.idleInv)

	// If Mask killed facing left he stands!
		
	v.g.backgroundInterval = setInterval(() => {
		v.g.c.fillStyle = 'black'; v.g.c.fillRect(0, 0, v.g.canvas.width, v.g.canvas.height)
		v.background.update(v.g)
		v.shop.update(v.g)
		winner.update(v.g)
		loser.death_update(v.g)

		// update_keys2(v, v.player, v.keys.d.pressed, v.keys.a.pressed, v.keys.w.pressed, 'd', 'a')
		// update_keys2(v, v.enemy, v.keys.ArrowRight.pressed, v.keys.ArrowLeft.pressed, v.keys.ArrowUp.pressed, 'ArrowRight', 'ArrowLeft')
		
	}, 1000 / v.g.fps)
	

	document.querySelector('#game2-end-text').innerHTML = winner.name + ' wins!\nPRESS X TO LEAVE'
	document.querySelector('#game2-end-text').style.display = 'flex'


	// Reset variables!
	// Do we really?
	// YES!!!
	// Not going global!

	Matchmaking_leave_game(v)

	
}

async function Matchmaking_game_end_tie(v) {
	
	await Matchmaking_sleep(1000)
	
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
	Matchmaking_reset_keys(v)
	
	v.g.backgroundInterval = setInterval(() => {
		v.g.c.fillStyle = 'black'; v.g.c.fillRect(0, 0, v.g.canvas.width, v.g.canvas.height)
		v.background.update(v.g)
		v.shop.update(v.g)
		v.player.update(v.g)
		v.enemy.update(v.g)
	}
	, 1000 / v.g.fps)
	
	document.querySelector('#game2-end-text').innerHTML = 'Tie!\nPRESS X TO LEAVE'
	document.querySelector('#game2-end-text').style.display = 'flex'

	Matchmaking_leave_game(v)
	
}

