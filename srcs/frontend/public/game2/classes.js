class Sprite {
	// time = shop.time = 10
	constructor({ position, imageSrc, scale = 1, framesMax = 1, time = 10 , img_offset = {x: 0, y: 0}}) {
		this.position = position
		this.height = 150
		this.width = 50
		this.image = new Image()
		this.image.src = imageSrc
		this.scale = scale
		this.framesMax = framesMax
		this.time = time
		this.framesCurrent = 0
		this.framesElapsed = 0
		this.img_offset = img_offset
	}
	draw(c) {
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
	
	animateFrames(fps) {
		this.framesElapsed++
		if (this.framesElapsed >= fps / this.time)
		{
			if (this.framesCurrent < this.framesMax - 1)
				this.framesCurrent++
			else
				this.framesCurrent = 0
			this.framesElapsed = 0
		}
	}

	update(g) {
		this.draw(g.c)
		this.animateFrames(g.fps)
	}

	update_frame(c) {
		this.draw(c)
		
		if (this.framesCurrent < this.framesMax - 1)
			this.framesCurrent++
		else
			this.framesCurrent = 0
	}
}

class Fighter extends Sprite {
	constructor({ name, position, velocity, color, offset, bar , scale = 1, imageSrc, framesMax = 1, img_offset = {x: 0, y: 0}, sprites, hit_frame, hit_frameInv, facing}) {
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
			width: 250,
			height: 150
		}
		this.isAttacking
		this.stunned = false
		
		
		this.bar = document.querySelector('#game2-bar' + bar)
		
		this.framesCurrent = 0
		this.framesElapsed = 0
		
		this.sprites = sprites
		this.hit_frame = hit_frame
		this.hit_frameInv = hit_frameInv
		this.time = 10

		for (const sprite in this.sprites) {
			sprites[sprite].image = new Image()
			sprites[sprite].image.src = sprites[sprite].imageSrc
		}
		this.facing = facing
	}
	
	get_hit(other, g) {

		this.velocity.y = -10

		if (other.facing == 'right') {
			this.velocity.x = g.knockback
			this.change_sprites(this.sprites.hit)
		}
		else {
			this.velocity.x = -1 * g.knockback
			this.change_sprites(this.sprites.hitInv)
		}

		this.stunned = true
		setTimeout(() => {this.stunned = false}, g.stun_time)
		this.health -= g.hit_dmg
		this.bar.style.width = this.health + '%'
		if (this.health <= 0)
		{
			this.bar.style.width = '0%'
			game_end(v)
		}
	}

	draw(c) {
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
	
	attack() {
		
		if (this.stunned == false && this.attackCD == false) {
			if (Math.random() < 0.5) {
				if (this.facing == 'right')
					this.change_sprites(this.sprites.attack1)
				else
					this.change_sprites(this.sprites.attack1Inv)
			}
			else {
				if (this.facing == 'right')
					this.change_sprites(this.sprites.attack2)
				else
					this.change_sprites(this.sprites.attack2Inv)
			} 
			this.isAttacking = true
			this.attackCD = true
			setTimeout(() => {this.isAttacking = false}, 10)
			setTimeout(() => {this.attackCD = false}, 250)
		}
	}
	update(g) {
				
		this.draw(g.c)
		this.animateFrames(g.fps)

			
		this.attackbox.position.x = this.position.x + this.attackbox.offset.x;
		this.attackbox.position.y = this.position.y;

		// c.fillStyle = 'red'
		// c.fillRect(this.attackbox.position.x, this.attackbox.position.y, this.attackbox.width, this.attackbox.height, 'red')

		// c.fillStyle = 'green'
		// c.fillRect(this.position.x, this.position.y, this.width, this.height)

		this.velocity.y += g.gravity

		if (this.position.y + this.velocity.y + this.height >= g.canvas.height - g.ground_height) {
			this.position.y = g.canvas.height - this.height - g.ground_height
			this.velocity.y = 0
		}
		

		if (this.position.y + this.velocity.y + this.height >= g.canvas.height - g.ground_height)
			this.position.y = g.canvas.height - this.height - g.ground_height
		else if (this.position.y + this.velocity.y <= 0) {
			this.position.y = 0; this.velocity.y = 0
		}
		else
			this.position.y += this.velocity.y
		
		if (this.position.x + this.velocity.x + this.width >= g.canvas.width)
			this.position.x = g.canvas.width - this.width
		else if (this.position.x + this.velocity.x <= 0)
			this.position.x = 0
		else		
			this.position.x += this.velocity.x

	}

	death_update(g) {
		this.draw(g.c)
		
		if (this.framesCurrent < this.framesMax - 1)
			this.animateFrames(g.fps)

		this.velocity.y += g.gravity

		if (this.position.y + this.velocity.y + this.height >= g.canvas.height - g.ground_height) {
			this.position.y = g.canvas.height - this.height - g.ground_height
			this.velocity.y = 0
		}
		
		if (this.position.y + this.velocity.y + this.height >= g.canvas.height - g.ground_height)
			this.position.y = g.canvas.height - this.height - g.ground_height
		else if (this.position.y + this.velocity.y <= 0) {
			this.position.y = 0; this.velocity.y = 0
		}
		else
			this.position.y += this.velocity.y
		
		if (this.position.x + this.velocity.x + this.width >= g.canvas.width)
			this.position.x = g.canvas.width - this.width
		else if (this.position.x + this.velocity.x <= 0)
			this.position.x = 0
		else		
			this.position.x += this.velocity.x
	
	}

	update_frame(c) {
		this.draw(c)
		
		if (this.framesCurrent < this.framesMax - 1)
			this.framesCurrent++
		else
			this.framesCurrent = 0
	}


	check_sprites_middle_animation() {
		
		// Attack
		if ((this.image == this.sprites.attack1.image || this.image == this.sprites.attack2.image || this.image == this.sprites.hit.image)
			&& (this.framesCurrent < this.sprites.attack1.framesMax - 1 || this.framesCurrent < this.sprites.attack2.framesMax - 1))
			return true
		if ((this.image == this.sprites.attack1Inv.image || this.image == this.sprites.attack2Inv.image || this.image == this.sprites.hitInv.image)
			&& (this.framesCurrent < this.sprites.attack1Inv.framesMax - 1 || this.framesCurrent < this.sprites.attack2Inv.framesMax - 1))
			return true
			


		// Take Hit
		if (this.image == this.sprites.hit.image && this.framesCurrent < this.sprites.hit.framesMax - 1)
			return true
		if (this.image == this.sprites.hitInv.image && this.framesCurrent < this.sprites.hitInv.framesMax - 1)
			return true

		// Death
		if (this.image == this.sprites.death.image 	&& this.framesCurrent < this.sprites.death.framesMax - 1)
			return true
		if (this.image == this.sprites.deathInv.image && this.framesCurrent < this.sprites.deathInv.framesMax - 1)
			return true

		return false
	}
	
	change_sprites(sprite, force = false) {
		
		if (this.check_sprites_middle_animation() && force == false)
			return
		if (this.image != sprite.image) {
			this.image = sprite.image
			this.framesMax = sprite.framesMax
			this.time = sprite.time
			this.framesCurrent = 0
			this.framesElapsed = 0
		}
	}

}
