window.onload = startGame2;

const canvas = document.getElementById('game2-area');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.5;

const keys = {
	d: { pressed: false },
	a: { pressed: false },
	w: { pressed: false },
	
	ArrowRight: { pressed: false },
	ArrowLeft: { pressed: false },
	ArrowUp: { pressed: false },
}

class Sprite {
	constructor({ position,  velocity, color}) {
		this.position = position;
		this.velocity = velocity;
		this.height = 150
		this.width = 50
		this.lastKey = '';
		this.attackbox = {
			position: this.position,
			width: 150,
			height: 50
		}
		this.color = color;
	}

	draw() {
		c.fillStyle = this.color;
		c.fillRect(this.position.x, this.position.y, this.width, this.height);

		c.fillStyle = 'red';
		c.fillRect(this.attackbox.position.x, this.attackbox.position.y, this.attackbox.width, this.attackbox.height);
	}
	
	update() {
		this.draw()

		this.velocity.y += gravity;
		if (this.position.y + this.velocity.y + this.height >= canvas.height)
			this.position.y = canvas.height - this.height;
		else if (this.position.y + this.velocity.y <= 0) {
			this.position.y = 0; this.velocity.y = 0;
		}
		else
			this.position.y += this.velocity.y;
		
		if (this.position.x + this.velocity.x <= 0 || this.position.x + this.velocity.x + this.width === canvas.width)
			this.velocity.x = 0;
		this.position.x += this.velocity.x;
		
	}
} 

const player = new Sprite({
	position: { x: 0, y: 0},
	velocity: { x: 0, y: 0},
	color: 'blue',

})

const enemy = new Sprite({
	position : { x: 400, y: 100},
	velocity: { x: 0, y: 0},
	color: 'green',
})


window.addEventListener('keydown', (event) => {
	switch (event.key) {
		case 'd':keys.d.pressed = true; player.lastKey = 'd'; break;
		case 'a':keys.a.pressed = true; player.lastKey = 'a'; break;
		case 'w':keys.w.pressed = true; break;

		case 'ArrowRight':keys.ArrowRight.pressed = true; enemy.lastKey = 'ArrowRight'; break;
		case 'ArrowLeft':keys.ArrowLeft.pressed = true; enemy.lastKey = 'ArrowLeft'; break;
		case 'ArrowUp':keys.ArrowUp.pressed = true; break;
	}
})

window.addEventListener('keyup', (event) => {
	switch (event.key) {
		case 'd':keys.d.pressed = false; break;
		case 'a':keys.a.pressed = false; break;
		case 'w':keys.w.pressed = false; break;

		case 'ArrowRight':keys.ArrowRight.pressed = false; break;
		case 'ArrowLeft':keys.ArrowLeft.pressed = false; break;
		case 'ArrowUp':keys.ArrowUp.pressed = false; break;
	}
})


function startGame2()
{
	game_loop();
	
}

function game_loop() {
	window.requestAnimationFrame(game_loop);
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height);
	player.update();
	enemy.update();

	update_keys();
}

function update_keys() {
	player.velocity.x = 0;
	if (keys.d.pressed && player.lastKey === 'd')
		player.velocity.x = 5
	if (keys.a.pressed && player.lastKey === 'a')
		player.velocity.x = -5
	if (keys.w.pressed && player.position.y === canvas.height - player.height )
		player.velocity.y = -19

	enemy.velocity.x = 0;
	if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight')
		enemy.velocity.x = 5
	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft')
		enemy.velocity.x = -5
	if (keys.ArrowUp.pressed && enemy.position.y === canvas.height - enemy.height )
		enemy.velocity.y = -19
}
