class Sprite {
	constructor({ position, imageSrc, scale = 1, framesMax = 1, img_offset = {x: 0, y: 0}}) {
		this.position = position
		this.height = 150
		this.width = 50
		this.image = new Image()
		this.image.src = imageSrc
		this.scale = scale
		this.framesMax = framesMax
		this.framesCurrent = 0
		this.framesElapsed = 0
		this.img_offset = img_offset
	}
	draw() {
		c.drawImage(
			this.image,
			this.framesCurrent * (this.image.width / this.framesMax),
			0,
			this.image.width / this.framesMax,
			this.image.height,

			this.position.x - this.img_offset.x,
			this.position.y - this.img_offset.y,
			(this.image.width / this.framesMax) * this.scale,
			this.image.height * this.scale
		)
	}
	
	animateFrames() {
		this.framesElapsed++
		if (this.framesElapsed >= fps / this.framesMax)
		{
			if (this.framesCurrent < this.framesMax - 1)
				this.framesCurrent++
			else
				this.framesCurrent = 0
			this.framesElapsed = 0
		}
	}

	update() {
		this.draw()
		this.animateFrames()
	}
}

class Fighter extends Sprite {
	constructor({ name, position, velocity, color, offset, bar , scale = 1, imageSrc, framesMax = 1, img_offset = {x: 0, y: 0}, sprites}) {
		{
			super({ position, imageSrc, scale, framesMax, img_offset})
		}
		this.name = name
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
		
		this.framesCurrent = 0
		this.framesElapsed = 0
		
		this.sprites = sprites
		
		for (const sprite in this.sprites) {
			sprites[sprite].image = new Image()
			sprites[sprite].image.src = sprites[sprite].imageSrc
		}
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
				// Code to execute after 200 ms
				game_end(v)
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
	update() {
		this.draw()
		this.animateFrames()

		this.attackbox.position.x = this.position.x + this.attackbox.offset.x;
		this.attackbox.position.y = this.position.y;

		this.velocity.y += gravity

		if (this.position.y + this.velocity.y + this.height >= canvas.height - ground_height) {
			this.position.y = canvas.height - this.height - ground_height

			this.velocity.y = 0
			if (this.velocity.x == 0)
				this.change_sprites(this.sprites.idle)
		}
		

		if (this.position.y + this.velocity.y + this.height >= canvas.height - ground_height)
			this.position.y = canvas.height - this.height - ground_height
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

	change_sprites(sprite) {
		if (this.image != sprite.image) {
			this.image = sprite.image
			this.framesMax = sprite.framesMax
			this.framesCurrent = 0
		}
	}

}
