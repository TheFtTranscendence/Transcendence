function startGame2(player1, player2, skins1, skins2, skinId1, skinId2, tournamentGame) {
	
	v = init_vars(player1, player2, skins1, skins2, skinId1, skinId2, tournamentGame)
	setup_canvas(v)

	window.addEventListener('keydown', game2_keydown)
	window.addEventListener('keyup', game2_keyup)
	window.addEventListener('hashchange', game2_hashchange)

	v.g.gameInterval = window.setInterval(() => game_loop(v), 1000 / v.g.fps)
	v.g.timerInterval = window.setInterval(() => decreaseTimer(v), 1000)
}
	
	
function decreaseTimer(v) {
	if (v.g.time > 0)
		v.g.time -= 1
	v.g.timer.innerHTML = v.g.time
	if (v.g.time == 0) {
		game_end(v)
	}
}


function game_loop(v) {
	// Not needed but keep it just in case
	v.g.c.fillStyle = 'black'; v.g.c.fillRect(0, 0, v.g.canvas.width, v.g.canvas.height)
	
	// Calculating if attackbox changes direction
	update_attackbox_offset(v.player)
	update_attackbox_offset(v.enemy)
	
	// Draw and update all objects
	v.background.update(v.g)
	v.shop.update(v.g)
	v.player.update(v.g)
	v.enemy.update(v.g)

	// Update keys of fighters
	update_keys2(v, v.player, v.keys.d.pressed, v.keys.a.pressed, v.keys.w.pressed, 'd', 'a')
	update_keys2(v, v.enemy, v.keys.ArrowRight.pressed, v.keys.ArrowLeft.pressed, v.keys.ArrowUp.pressed, 'ArrowRight', 'ArrowLeft')
	
	// Detect attackbox colision if attacking
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
	// Drag update
	if (guy.velocity.x > 0)
		guy.velocity.x -= v.g.drag
	else if (guy.velocity.x < 0)
		guy.velocity.x += v.g.drag
	else if (guy.velocity.x <= 2 && guy.velocity.x >= -2)
		guy.velocity.x = 0

	// Move right or left
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
	// Idle check
	else if (guy.position.y === v.g.canvas.height - guy.height - v.g.ground_height)
	{
		if (guy.facing === 'right')
			guy.change_sprites(guy.sprites.idle)
		else
			guy.change_sprites(guy.sprites.idleInv)
	}

	// Jump check
	if (key_jump && guy.position.y === v.g.canvas.height - guy.height - v.g.ground_height && guy.stunned == false)
		guy.velocity.y = -20
	
	// Changing sprite to jumping or falling, if in air
	if (guy.velocity.y < 0 && guy.facing == 'right')
		guy.change_sprites(guy.sprites.jump)
	else if (guy.velocity.y < 0  && guy.facing == 'left')
		guy.change_sprites(guy.sprites.jumpInv)
	else if (guy.velocity.y > 0  && guy.facing == 'right')
		guy.change_sprites(guy.sprites.fall)
	else if (guy.velocity.y > 0  && guy.facing == 'left')
		guy.change_sprites(guy.sprites.fallInv)
}

function detect_colision(Attacker, Victim, g) {
	if (Attacker.isAttacking && 
		Attacker.attackbox.position.x + Attacker.attackbox.width >= Victim.position.x &&
		Attacker.attackbox.position.x <= Victim.position.x + Victim.width &&
		Attacker.attackbox.position.y + Attacker.attackbox.height >= Victim.position.y &&
		Attacker.attackbox.position.y <= Victim.position.y + Victim.height)
	{
		console.log(Attacker.name + " attacked!")
		Attacker.isAttacking = false
		Victim.get_hit(Attacker, g)
	}
} 