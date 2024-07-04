window.onload = startGame2;

const canvas = document.getElementById('game2-area');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;


class Sprite {
	constructor({ position,  velocity }) {
		this.position = position;
		this.velocity = velocity;
		this.height = 150
		this.width = 50
	}

	draw() {
		c.fillStyle = 'red';
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
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
			
		if (this.position.x + this.velocity.x <= 0 || this.position.x + this.velocity.x + this.width == canvas.width)
			this.velocity.x = 0;
		this.position.x += this.velocity.x;
		
	}
} 



const player = new Sprite({
	position: { x: 0, y: 0},
	velocity: { x: 0, y: 0},
})

const enemy = new Sprite({
	position : { x: 400, y: 100},
	velocity: { x: 0, y: 0},
})


window.addEventListener('keydown', (event) => {
	switch (event.key) {
		case 'd': player.velocity.x = 1; break;
		case 'a': player.velocity.x = -1; break;
		case 'w': player.velocity.y = -10; break;
	}
})

window.addEventListener('keyup', (event) => {
	switch (event.key) {
		case 'd': player.velocity.x = 0; break;
		case 'a': player.velocity.x = 0; break;
		case 'w': player.velocity.y = 0; break;
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
}
