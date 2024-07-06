window.onload = startGame2

const canvas = document.getElementById('game2-area')
const c = canvas.getContext('2d')
canvas.width = 1366
canvas.height = 768

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5
const drag = .50
const knockback = 25
const fps = 100
const keys = {
	d: { pressed: false },
	a: { pressed: false },
	w: { pressed: false },
	
	ArrowRight: { pressed: false },
	ArrowLeft: { pressed: false },
	ArrowUp: { pressed: false },
}

class Sprite {
	constructor({ name, position,  velocity, color, offset, bar }) {
		this.name = name
		this.position = position
		this.velocity = velocity
		this.height = 150
		this.width = 50
		this.color = color
		this.attackCD = false

		this.health = 100
		this.lastKey = ''
		
		this.attackbox = {
			position: { x: this.position.x, y: this.position.y },
			offset, // same as offset: offset
			width: 100,
			height: 50
		}
		this.isAttacking
		this.stunned = false
		
		this.bar = document.querySelector('#game2-bar' + bar)
	}
	
	get_hit(other) {

		this.velocity.y = -10

		if (other.position.x < this.position.x)
			this.velocity.x = knockback
		else
			this.velocity.x = -1 * knockback
		
		this.stunned = true
		setTimeout(() => {this.stunned = false}, 150)
		this.health -= 10
		this.bar.style.width = this.health + '%'

		if (this.health <= 0)
		{
			this.bar.style.width = '0%'
			setTimeout(() => {
				// Code to execute after 1 second
				game_end()
			}, 200);
		}
	}

	attack() {
		if (this.stunned == false && this.attackCD == false) {
			this.isAttacking = true
			this.attackCD = true
			setTimeout(() => {this.isAttacking = false}, 10)
			setTimeout(() => {this.attackCD = false}, 250)
		}
		
	}

	draw() {
		c.fillStyle = this.color
		c.fillRect(this.position.x, this.position.y, this.width, this.height)

		if (this.isAttacking) {
			c.fillStyle = 'red'
			c.fillRect(this.attackbox.position.x, this.attackbox.position.y, this.attackbox.width, this.attackbox.height)
		}
	}
	
	update() {
		this.draw()
		
		this.attackbox.position.x = this.position.x + this.attackbox.offset.x;
		this.attackbox.position.y = this.position.y;

		this.velocity.y += gravity
		if (this.position.y + this.velocity.y + this.height >= canvas.height)
			this.position.y = canvas.height - this.height
		else if (this.position.y + this.velocity.y <= 0) {
			this.position.y = 0; this.velocity.y = 0
		}
		else
			this.position.y += this.velocity.y
		
		if (this.position.x + this.velocity.x + this.width >= canvas.width)
			this.position.x = canvas.width - this.width
		else if (this.position.x + this.velocity.x <= 0)
			this.position.x = 0
		else		
			this.position.x += this.velocity.x
		
		}
}

class Fighter {
	constructor({ position }) {
		this.position = position
		this.height = 150
		this.width = 50

	}
	draw() {

	}
	
	update() {
		this.draw()

		}
} 


const player = new Sprite({
	name: 'player',
	position: { x: canvas.width / 4, y: canvas.height - 150},
	velocity: { x: 0, y: 0},
	color: 'lightblue',
	offset: { x: 0, y: 0},
	bar: 1
})

const enemy = new Sprite({
	name: 'enemy',
	position : { x: canvas.width * 3 / 4, y: canvas.height - 150},
	velocity: { x: 0, y: 0},
	color: 'white',
	offset: { x: -50, y: 0},
	bar: 2
})



window.addEventListener('keydown', (event) => {
	switch (event.key) {
		case 'd':keys.d.pressed = true; player.lastKey = 'd'; break
		case 'a':keys.a.pressed = true; player.lastKey = 'a'; break
		case 'w':keys.w.pressed = true; break
		case ' ':player.attack(); break
		
		case 'ArrowRight':keys.ArrowRight.pressed = true; enemy.lastKey = 'ArrowRight'; break
		case 'ArrowLeft':keys.ArrowLeft.pressed = true; enemy.lastKey = 'ArrowLeft'; break
		case 'ArrowUp':keys.ArrowUp.pressed = true; break
		case 'Enter':enemy.attack(); break
	}
})

window.addEventListener('keyup', (event) => {
	switch (event.key) {
		case 'd':keys.d.pressed = false; break
		case 'a':keys.a.pressed = false; break
		case 'w':keys.w.pressed = false; break
		
		case 'ArrowRight':keys.ArrowRight.pressed = false; break
		case 'ArrowLeft':keys.ArrowLeft.pressed = false; break
		case 'ArrowUp':keys.ArrowUp.pressed = false; break
	}
})

let gameInterval;
let timerInterval;

function startGame2() {
	

	gameInterval = window.setInterval(() => game_loop(), 1000 / fps)
	timerInterval = window.setInterval(() => decreaseTimer(), 1000)
}


function decreaseTimer() {
	const timer = document.querySelector('#game2-timer')
	let time = parseInt(timer.innerHTML)
	time -= 1
	timer.innerHTML = time
	if (time == 0) {
		game_end()
	}
}


function game_loop(v) {
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)
	
	update_offset()
	
	player.update()
	enemy.update()

	detect_colision(player, enemy)
	detect_colision(enemy, player)

	update_keys()

	console.log('player' + player.velocity.x)
	console.log('enemy' + enemy.velocity.x)
}

function update_offset()
{
	if (player.position.x < enemy.position.x) {
		player.attackbox.offset.x = 0
		enemy.attackbox.offset.x = 50 - enemy.attackbox.width
	}
	else {
		player.attackbox.offset.x = 50 - player.attackbox.width	
		enemy.attackbox.offset.x = 0
	}
}

function update_keys() {
	if (player.velocity.x > 0)
		player.velocity.x -= drag
	else if (player.velocity.x < 0)
		player.velocity.x += drag
	else if (player.velocity.x <= 2 && player.velocity.x >= -2)
		player.velocity.x = 0


	if (keys.d.pressed && player.lastKey === 'd' && player.stunned == false)
		player.velocity.x = 5
	if (keys.a.pressed && player.lastKey === 'a' && player.stunned == false)
		player.velocity.x = -5
	if (keys.w.pressed && player.position.y === canvas.height - player.height && player.stunned == false)
		player.velocity.y = -20

	if (enemy.velocity.x > 0)
		enemy.velocity.x -= drag
	else if (enemy.velocity.x < 0)
		enemy.velocity.x += drag
	else if (enemy.velocity.x <= 2 && enemy.velocity.x >= -2)
		enemy.velocity.x = 0


	if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && enemy.stunned == false)
		enemy.velocity.x = 5
	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && enemy.stunned == false)
		enemy.velocity.x = -5
	if (keys.ArrowUp.pressed && enemy.position.y === canvas.height - enemy.height && enemy.stunned == false)
		enemy.velocity.y = -20

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

function game_end() {
	clearInterval(gameInterval);
    clearInterval(timerInterval);

	if (player.health > enemy.health)
		document.querySelector('#game2-end-text').innerHTML = 'Player Wins!'
	else if (player.health < enemy.health)
		document.querySelector('#game2-end-text').innerHTML = 'Enemy Wins!'
	else
		document.querySelector('#game2-end-text').innerHTML = 'Player Wins!'

	document.querySelector('#game2-end-text').style.display = 'flex'
}