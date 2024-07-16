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
	
	gameInterval = window.setInterval(() => game_loop(v), 1000 / fps)
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
	
	v.background.update()
	v.shop.update()
	v.player.update()
	v.enemy.update()

	update_keys(v)
	
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

function update_keys(v) {

	if (v.player.velocity.x > 0)
		v.player.velocity.x -= drag
	else if (v.player.velocity.x < 0)
		v.player.velocity.x += drag
	else if (v.player.velocity.x <= 2 && v.player.velocity.x >= -2)
		v.player.velocity.x = 0


	if (v.keys.d.pressed && v.player.lastKey === 'd' && v.player.stunned == false) {
		v.player.velocity.x = 5
		v.player.facing = 'right'
		v.player.change_sprites(v.player.sprites.run)
	}
	else if (v.keys.a.pressed && v.player.lastKey === 'a' && v.player.stunned == false) {
		v.player.velocity.x = -5
		v.player.facing = 'left'
		v.player.change_sprites(v.player.sprites.runInv)
	}
	else if (v.player.position.y === canvas.height - v.player.height - ground_height)
	{
		if (v.player.facing === 'right')
			v.player.change_sprites(v.player.sprites.idle)
		else
			v.player.change_sprites(v.player.sprites.idleInv)
	}

	if (v.keys.w.pressed && v.player.position.y === canvas.height - v.player.height - ground_height && v.player.stunned == false)
		v.player.velocity.y = -20
	
	if (v.player.velocity.y < 0 && v.player.facing == 'right')
		v.player.change_sprites(v.player.sprites.jump)
	else if (v.player.velocity.y < 0  && v.player.facing == 'left')
		v.player.change_sprites(v.player.sprites.jumpInv)
	else if (v.player.velocity.y > 0  && v.player.facing == 'right')
		v.player.change_sprites(v.player.sprites.fall)
	else if (v.player.velocity.y > 0  && v.player.facing == 'left')
		v.player.change_sprites(v.player.sprites.fallInv)
	
	
	if (v.enemy.velocity.x > 0)
		v.enemy.velocity.x -= drag
	else if (v.enemy.velocity.x < 0)
		v.enemy.velocity.x += drag
	else if (v.enemy.velocity.x <= 2 && v.enemy.velocity.x >= -2)
		v.enemy.velocity.x = 0

	
	if (v.keys.ArrowRight.pressed && v.enemy.lastKey === 'ArrowRight' && v.enemy.stunned == false) {
		v.enemy.velocity.x = 5
		v.enemy.facing = 'right'
		v.enemy.change_sprites(v.enemy.sprites.run)
		
	}
	else if (v.keys.ArrowLeft.pressed && v.enemy.lastKey === 'ArrowLeft' && v.enemy.stunned == false) {
		v.enemy.velocity.x = -5
		v.enemy.facing = 'left'
		v.enemy.change_sprites(v.enemy.sprites.runInv)
	}
	else if (v.enemy.position.y === canvas.height - v.enemy.height - ground_height)
	{
		if (v.enemy.facing === 'right')
			v.enemy.change_sprites(v.enemy.sprites.idle)
		else if (v.enemy.facing === 'left')
			v.enemy.change_sprites(v.enemy.sprites.idleInv)
	}


	if (v.keys.ArrowUp.pressed && v.enemy.position.y === canvas.height - v.enemy.height - ground_height  && v.enemy.stunned == false)
		v.enemy.velocity.y = -20
	
	if (v.enemy.velocity.y < 0 && v.enemy.facing == 'right')
		v.enemy.change_sprites(v.enemy.sprites.jump)
	else if (v.enemy.velocity.y > 0 && v.enemy.facing == 'left')
		v.enemy.change_sprites(v.enemy.sprites.fall)
	else if (v.enemy.velocity.y < 0 && v.enemy.facing == 'right')
		v.enemy.change_sprites(v.enemy.sprites.jumpInv)
	else if (v.enemy.velocity.y > 0 && v.enemy.facing == 'left')
		v.enemy.change_sprites(v.enemy.sprites.fallInv)
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
		v.background.update()
		v.shop.update()
		winner.update()
		loser.death_update()
	}, 1000 / fps)
	
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

	
	console.log('Game Ended!')
}