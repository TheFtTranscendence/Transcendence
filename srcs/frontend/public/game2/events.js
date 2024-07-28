function game2_keydown(event) {
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
}

function game2_keyup(event) {
	switch (event.key) {
		case 'd': v.keys.d.pressed = false; break
		case 'a': v.keys.a.pressed = false; break
		case 'w': v.keys.w.pressed = false; break
		
		case 'ArrowRight': v.keys.ArrowRight.pressed = false; break
		case 'ArrowLeft': v.keys.ArrowLeft.pressed = false; break
		case 'ArrowUp': v.keys.ArrowUp.pressed = false; break
	}
}

function game2_hashchange(event) {
	console.log('leaving game')
	leave_game(v)
}