
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

	const canvas_width = 1366
	const canvas_height = 768
	const stun_time = 150 // ms
	const ground_height = 50 // px
	
	v = init_vars(canvas_width, canvas_height, stun_time, ground_height)
	v.g.canvas = document.getElementById('game2-area')
	v.g.c = v.g.canvas.getContext('2d')
	v.g.canvas.width = v.g.canvas_width
	v.g.canvas.height = v.g.canvas_height
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
	v.g.c.fillStyle = 'black'; v.g.c.fillRect(0, 0, v.g.canvas.width, v.g.canvas.height)
	
	update_attackbox_offset(v.player)
	update_attackbox_offset(v.enemy)
	
	v.background.update(v.g.fps, v.g)
	v.shop.update(v.g.fps, v.g)
	v.player.update(v.g.fps, v.g)
	v.enemy.update(v.g.fps, v.g)

	update_keys2(v, v.player, v.keys.d.pressed, v.keys.a.pressed, v.keys.w.pressed, 'd', 'a')
	update_keys2(v, v.enemy, v.keys.ArrowRight.pressed, v.keys.ArrowLeft.pressed, v.keys.ArrowUp.pressed, 'ArrowRight', 'ArrowLeft')
	
	detect_colision(v.player, v.enemy, v.g)
	detect_colision(v.enemy, v.player, v.g)

}

function update_attackbox_offset(guy)
{
	if (guy.velocity.x > 1)
		guy.attackbox.offset.x = 0
	else if (guy.velocity.x < -1)
		guy.attackbox.offset.x = 50 - guy.attackbox.width
}

function update_keys2(v, guy, keyPress_left, keyPress_right, key_jump, key_right, key_left) {
	if (guy.velocity.x > 0)
		guy.velocity.x -= v.g.drag
	else if (guy.velocity.x < 0)
		guy.velocity.x += v.g.drag
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
	else if (guy.position.y === v.g.canvas.height - guy.height - v.g.ground_height)
	{
		if (guy.facing === 'right')
			guy.change_sprites(guy.sprites.idle)
		else
			guy.change_sprites(guy.sprites.idleInv)
	}

	if (key_jump && guy.position.y === v.g.canvas.height - guy.height - v.g.ground_height && guy.stunned == false)
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

function detect_colision(Sprite1, Sprite2, g) {
	if (Sprite1.isAttacking && Sprite1.attackbox.position.x + Sprite1.attackbox.width >= Sprite2.position.x &&
		Sprite1.attackbox.position.x <= Sprite2.position.x + Sprite2.width &&
		Sprite1.attackbox.position.y + Sprite1.attackbox.height >= Sprite2.position.y &&
		Sprite1.attackbox.position.y <= Sprite2.position.y + Sprite2.height)
	{
		console.log(Sprite1.name + " Attacked!")
		Sprite1.isAttacking = false
		Sprite2.get_hit(Sprite1, g)
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

	backgroundInterval = setInterval(() => {
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

	// Para registar na blockchain o jogo
	// axios.post('http://localhost:8001/solidity/addgame')
	
	console.log('Game Ended!')
}