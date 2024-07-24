const canvas = document.getElementById('game2-area')
const c = canvas.getContext('2d')
canvas.width = canvas_width
canvas.height = canvas_height
c.fillRect(0, 0, canvas.width, canvas.height)

window.addEventListener('keydown', (event) => {
	switch (event.key) {
		case 'd':v.keys.d.pressed = true; v.player.lastKey = 'd'; break
		case 'a':v.keys.a.pressed = true; v.player.lastKey = 'a'; break
		case 'w':v.keys.w.pressed = true; break
		case ' ':v.player.attack(); break
		
		case 'ArrowRight':v.keys.ArrowRight.pressed = true; v.enemy.lastKey = 'ArrowRight'; break
		case 'ArrowLeft':v.keys.ArrowLeft.pressed = true; v.enemy.lastKey = 'ArrowLeft'; break
		case 'ArrowUp':v.keys.ArrowUp.pressed = true; break
		case 'Enter':v.enemy.attack(); break
	}
})

// Let it be for now
// window.addEventListener('unload', (event) => {
	// 	clearInterval(gameInterval)
	// 	clearInterval(timerInterval)
	// 	clearInterval(backgroundInterval)
	// })
	
	window.addEventListener('keyup', (event) => {
		switch (event.key) {
			case 'd': v.keys.d.pressed = false; break
			case 'a': v.keys.a.pressed = false; break
			case 'w': v.keys.w.pressed = false; break
			
			case 'ArrowRight': v.keys.ArrowRight.pressed = false; break
			case 'ArrowLeft': v.keys.ArrowLeft.pressed = false; break
			case 'ArrowUp': v.keys.ArrowUp.pressed = false; break
		}
	})
	
	
	let gameInterval;
	let timerInterval;
	function startGame2() {
		
		v = init_vars()
		
		// Get usernames from the players
		// axios.get('http://localhost:8000/data/user_info/' + data.username).then((response) => { bla bla bla })

		gameInterval = window.setInterval(() => game_loop(v), 1000 / v.g.fps)
		timerInterval = window.setInterval(() => decreaseTimer(v), 1000)
	}
	
	
	function decreaseTimer(v) {
		const timer = document.querySelector('#game2-timer')
		let time = parseInt(timer.innerHTML)
		if (time > 0)
		time -= 1
	timer.innerHTML = time
	if (time == 0) {
		game_end(v)
	}
}


function game_loop(v) {
	c.fillStyle = 'black'; c.fillRect(0, 0, canvas.width, canvas.height)
	
	update_offset(v)
	
	v.background.update(v.g.fps)
	v.shop.update(v.g.fps)
	v.player.update(v.g.fps)
	v.enemy.update(v.g.fps)

	update_keys2(v.player, v.keys.d.pressed, v.keys.a.pressed, v.keys.w.pressed, 'd', 'a')
	update_keys2(v.enemy, v.keys.ArrowRight.pressed, v.keys.ArrowLeft.pressed, v.keys.ArrowUp.pressed, 'ArrowRight', 'ArrowLeft')
	
	detect_colision(v.player, v.enemy)
	detect_colision(v.enemy, v.player)

}

function update_offset(v)
{
	if (v.player.velocity.x > 1)
		v.player.attackbox.offset.x = 0
	else if (v.player.velocity.x < -1)
		v.player.attackbox.offset.x = 50 - v.player.attackbox.width

	if (v.enemy.velocity.x > 1)
		v.enemy.attackbox.offset.x = 0
	else if (v.enemy.velocity.x < -1)
		v.enemy.attackbox.offset.x = 50 - v.enemy.attackbox.width
}

function update_keys2(guy, keyPress_left, keyPress_right, key_jump, key_right, key_left) {
	if (guy.velocity.x > 0)
		guy.velocity.x -= drag
	else if (guy.velocity.x < 0)
		guy.velocity.x += drag
	else if (guy.velocity.x <= 2 && guy.velocity.x >= -2)
		guy.velocity.x = 0


	if (keyPress_left && guy.lastKey === key_right && guy.stunned == false) {
		guy.velocity.x = 5
		guy.facing = 'right'
		guy.change_sprites(guy.sprites.run)
	}
	else if (keyPress_right && guy.lastKey === key_left && guy.stunned == false) {
		guy.velocity.x = -5
		guy.facing = 'left'
		guy.change_sprites(guy.sprites.runInv)
	}
	else if (guy.position.y === canvas.height - guy.height - ground_height)
	{
		if (guy.facing === 'right')
			guy.change_sprites(guy.sprites.idle)
		else
			guy.change_sprites(guy.sprites.idleInv)
	}

	if (key_jump && guy.position.y === canvas.height - guy.height - ground_height && guy.stunned == false)
		guy.velocity.y = -20
	
	if (guy.velocity.y < 0 && guy.facing == 'right')
		guy.change_sprites(guy.sprites.jump)
	else if (guy.velocity.y < 0  && guy.facing == 'left')
		guy.change_sprites(guy.sprites.jumpInv)
	else if (guy.velocity.y > 0  && guy.facing == 'right')
		guy.change_sprites(guy.sprites.fall)
	else if (guy.velocity.y > 0  && guy.facing == 'left')
		guy.change_sprites(guy.sprites.fallInv)
}

function detect_colision(Sprite1, Sprite2) {
	if (Sprite1.isAttacking && Sprite1.attackbox.position.x + Sprite1.attackbox.width >= Sprite2.position.x &&
		Sprite1.attackbox.position.x <= Sprite2.position.x + Sprite2.width &&
		Sprite1.attackbox.position.y + Sprite1.attackbox.height >= Sprite2.position.y &&
		Sprite1.attackbox.position.y <= Sprite2.position.y + Sprite2.height)
	{
		console.log(Sprite1.name + " Attacked!")
		Sprite1.isAttacking = false
		Sprite2.get_hit(Sprite1)
	}
} 


function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

let backgroundInterval
async function game_end(v) {
	clearInterval(gameInterval);
    clearInterval(timerInterval);

	
	if (v.player.health > v.enemy.health) {
		loser = v.enemy
		winner = v.player
		if (v.player.facing == 'right')
			v.player.framesCurrent = Mask.hit_frame	
		else
			v.player.framesCurrent = Mask.hit_frameInv
	}
	else {
		loser = v.player
		winner = v.enemy
		if (v.enemy.facing == 'right')
			v.enemy.framesCurrent = Samu.hit_frame
		else
			v.enemy.framesCurrent = Samu.hit_frameInv
	}

	
	c.fillStyle = 'black'; c.fillRect(0, 0, canvas.width, canvas.height)
	
	v.background.update_game_end()
	v.shop.update_game_end()
	v.player.draw()
	v.enemy.draw()
	console.log('Players drawn')
	await sleep(1000)

	while (loser.framesCurrent < loser.framesMax - 1) {

		c.fillStyle = 'black'; c.fillRect(0, 0, canvas.width, canvas.height)

		v.background.update_game_end()
		v.shop.update_game_end()
		v.player.update_game_end()
		v.enemy.update_game_end()
		
		await sleep(1000)
	}

	winner.velocity.x = 0;
	reset_keys(v)
	update_keys(v)
	winner.framesCurrent = winner.framesMax

	
	if (loser.facing == 'right')
		loser.change_sprites(loser.sprites.death)
	else
		loser.change_sprites(loser.sprites.deathInv)
	
	if (winner.facing == 'right')
		winner.change_sprites(winner.sprites.idle)
	else 
		winner.change_sprites(winner.sprites.idleInv)

	backgroundInterval = setInterval(() => {
		c.fillStyle = 'black'; c.fillRect(0, 0, canvas.width, canvas.height)
		v.background.update(v.g.fps)
		v.shop.update(v.g.fps)
		winner.update(v.g.fps)
		loser.death_update(v.g.fps)
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

	// Para registar na blockchain o jogo
	// axios.post('http://localhost:8001/solidity/addgame')
	
	console.log('Game Ended!')
}