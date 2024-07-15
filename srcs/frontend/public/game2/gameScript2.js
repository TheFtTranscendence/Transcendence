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

// Crashes whole game
// window.addEventListener('unload', game_end(v))

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

	detect_colision(v.player, v.enemy)
	detect_colision(v.enemy, v.player)

	update_keys(v)
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
		v.player.change_sprites(v.player.sprites.run)
	}
	else if (v.keys.a.pressed && v.player.lastKey === 'a' && v.player.stunned == false) {
		v.player.velocity.x = -5
		v.player.change_sprites(v.player.sprites.run)
	}
	else
		v.player.change_sprites(v.player.sprites.idle)

	if (v.keys.w.pressed && v.player.position.y === canvas.height - v.player.height - ground_height && v.player.stunned == false) {
		v.player.velocity.y = -20
	}
	
	if (v.player.velocity.y < 0)
		v.player.change_sprites(v.player.sprites.jump)
	else if (v.player.velocity.y > 0)
		v.player.change_sprites(v.player.sprites.fall)

	if (v.enemy.velocity.x > 0)
		v.enemy.velocity.x -= drag
	else if (v.enemy.velocity.x < 0)
		v.enemy.velocity.x += drag
	else if (v.enemy.velocity.x <= 2 && v.enemy.velocity.x >= -2)
		v.enemy.velocity.x = 0

	if (v.enemy.velocity.y < 0)
		v.enemy.change_sprites(v.enemy.sprites.jump)
	else if (v.enemy.velocity.y > 0)
		v.enemy.change_sprites(v.enemy.sprites.fall)

	if (v.keys.ArrowRight.pressed && v.enemy.lastKey === 'ArrowRight' && v.enemy.stunned == false) {
		v.enemy.velocity.x = 5
		v.enemy.change_sprites(v.enemy.sprites.run)

	}
	else if (v.keys.ArrowLeft.pressed && v.enemy.lastKey === 'ArrowLeft' && v.enemy.stunned == false) {
		v.enemy.velocity.x = -5
		v.enemy.change_sprites(v.enemy.sprites.run)
	}
	else
		v.enemy.change_sprites(v.enemy.sprites.idle)

	if (v.keys.ArrowUp.pressed && v.enemy.position.y === canvas.height - v.enemy.height - ground_height  && v.enemy.stunned == false) {
		v.enemy.velocity.y = -20
	}

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

async function game_end_sequence(v) {
	console.log('Game ending sequence started')

	if (v.player.health > v.enemy.health) {
		loser = v.enemy
		winner = v.player
		v.player.framesCurrent = Mask.hit_frame
	}
	else {
		loser = v.player
		winner = v.enemy
		v.enemy.framesCurrent = Samu.hit_frame
	}

	
	c.fillStyle = 'black'; c.fillRect(0, 0, canvas.width, canvas.height)
	
	
	loser.change_sprites(loser.sprites.death)
	v.background.update_game_end()
	v.shop.update_game_end()
	v.player.draw()
	v.enemy.draw()
	console.log('Playres drawn')
	await sleep(1000)

	loser.change_sprites(loser.sprites.death)
	winner.change_sprites(winner.sprites.idle)
	while (loser.framesCurrent < loser.framesMax - 1) {

		c.fillStyle = 'black'; c.fillRect(0, 0, canvas.width, canvas.height)

		v.background.update_game_end()
		v.shop.update_game_end()
		v.player.update_game_end()
		v.enemy.update_game_end()
		
		console.log('WAINTING')
		await sleep(1000)
		console.log('not waiting lol')
	}

	console.log('Out of loop')

	loser.change_sprites(loser.sprites.death)
	winner.change_sprites(winner.sprites.idle)
	reset_keys(v)
	update_keys(v)
	backgroundInterval = setInterval(() => {
		c.fillStyle = 'black'; c.fillRect(0, 0, canvas.width, canvas.height)
		v.background.update()
		v.shop.update()
		winner.update()
		if (loser.framesCurrent < loser.framesMax - 1)
			loser.update()
		else
			loser.draw()
	}, 1000 / fps)
	console.log('Game ending sequence ended')

}

let backgroundInterval
async function game_end(v) {
	clearInterval(gameInterval);
    clearInterval(timerInterval);

	
	// console.log('Game ending sequence starting in 3 seconds')
	// await sleep(3000)
	
	game_end_sequence(v)

	if (v.player.health > v.enemy.health)
		document.querySelector('#game2-end-text').innerHTML = 'Player Wins!'
	else if (v.player.health < v.enemy.health)
		document.querySelector('#game2-end-text').innerHTML = 'Enemy Wins!'
	else
		document.querySelector('#game2-end-text').innerHTML = 'Tie!'

	document.querySelector('#game2-end-text').style.display = 'flex'

	// Reset variables!
	// Do we really?

	
	console.log('Game Ended!')
}