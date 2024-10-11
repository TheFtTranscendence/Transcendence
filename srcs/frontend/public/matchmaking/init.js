
function Matchmaking_init_vars() {
	
	canvas_width = 1366
	canvas_height = 768
	stun_time = 150 // ms
	ground_height = 50 // px
	
	return {
		background: new Matchmaking_Sprite({
			position: { x: 0, y: 0 },
			imageSrc: './game2/assets/background.png',
			scale: 1,
			framesMax: 1
		}),

		shop: new Matchmaking_Sprite({
			position: { x: 800, y: 320 },
			imageSrc: './game2/assets/shop.png',
			scale: 3,
			framesMax: 6
		}),

		keys:  {
			d: { pressed: false },
			a: { pressed: false },
			w: { pressed: false },
			
			ArrowRight: { pressed: false },
			ArrowLeft: { pressed: false },
			ArrowUp: { pressed: false },
		},
		
		g: {
			fps: 100,
			
			gameInterval: 0,
			timerInterval: 0,
			backgroundInterval: 0,
			timer: 0,
			time: 0,
			
			c: 0,
			canvas: 0,
			canvas_width: canvas_width,
			canvas_height: canvas_height,
			
			
			gravity: 0.5, // px
			drag: 0.5, // px
			knockback: 25, // px
			hit_dmg: 5, // %
			stun_time: stun_time, // ms
			ground_height: ground_height, // px
			
		},
		
		s: {
			game_socket: 0,
			queue_socket: 0,
			socketupdate: 0,
			gameId: 0,
			player1: 0,
			player2: 0
		}
	}
}

function Matchmaking_init_fighters(enemyName, enenmySkin, playerName, playerSkin, stun_time) {
	return {
		enemy: new Matchmaking_Fighter({
			name: enemyName,
			position : { x: canvas_width * 3 / 4, y: canvas_height - ground_height + 250},
			velocity: { x: 0, y: 0},
			color: 'white',
			offset: { x: -50, y: 0},
			bar: 2,
            imageSrc: enenmySkin.idleInv.imageSrc,
            framesMax: enenmySkin.idleInv.framesMax,
			scale: 2.5,
			img_offset: {x: 215, y: 165},
		sprites: {
			attack1: { imageSrc: enenmySkin.attack1.imageSrc, framesMax: enenmySkin.attack1.framesMax, time: enenmySkin.attack1.time },
			attack2: { imageSrc: enenmySkin.attack2.imageSrc, framesMax: enenmySkin.attack2.framesMax, time: enenmySkin.attack2.time },
			death: { imageSrc: enenmySkin.death.imageSrc, framesMax: enenmySkin.death.framesMax, time: enenmySkin.death.time },
			fall: { imageSrc: enenmySkin.fall.imageSrc, framesMax: enenmySkin.fall.framesMax, time: enenmySkin.fall.time },
			idle: { imageSrc: enenmySkin.idle.imageSrc, framesMax: enenmySkin.idle.framesMax, time: enenmySkin.idle.time },
			jump: { imageSrc: enenmySkin.jump.imageSrc, framesMax: enenmySkin.jump.framesMax, time: enenmySkin.jump.time },
			run: { imageSrc: enenmySkin.run.imageSrc, framesMax: enenmySkin.run.framesMax, time: enenmySkin.run.time },
			hit: { imageSrc: enenmySkin.hit.imageSrc, framesMax: enenmySkin.hit.framesMax, time: stun_time / enenmySkin.hit.framesMax },

			attack1Inv: { imageSrc: enenmySkin.attack1Inv.imageSrc, framesMax: enenmySkin.attack1Inv.framesMax, time: enenmySkin.attack1Inv.time },
			attack2Inv: { imageSrc: enenmySkin.attack2Inv.imageSrc, framesMax: enenmySkin.attack2Inv.framesMax, time: enenmySkin.attack2Inv.time },
			deathInv: { imageSrc: enenmySkin.deathInv.imageSrc, framesMax: enenmySkin.deathInv.framesMax, time: enenmySkin.deathInv.time },
			fallInv: { imageSrc: enenmySkin.fallInv.imageSrc, framesMax: enenmySkin.fallInv.framesMax, time: enenmySkin.fallInv.time },
			idleInv: { imageSrc: enenmySkin.idleInv.imageSrc, framesMax: enenmySkin.idleInv.framesMax, time: enenmySkin.idleInv.time },
			jumpInv: { imageSrc: enenmySkin.jumpInv.imageSrc, framesMax: enenmySkin.jumpInv.framesMax, time: enenmySkin.jumpInv.time },
			runInv: { imageSrc: enenmySkin.runInv.imageSrc, framesMax: enenmySkin.runInv.framesMax, time: enenmySkin.runInv.time },
			hitInv: { imageSrc: enenmySkin.hitInv.imageSrc, framesMax: enenmySkin.hitInv.framesMax, time: stun_time / enenmySkin.hitInv.framesMax },
		},
		hit_frame: 1,
		hit_frameInv: 1,
		facing : 'left',
	}),
	player: new Matchmaking_Fighter({
		name: playerName,
		position: { x: canvas_width / 4, y: canvas_height - ground_height + 250},
		velocity: { x: 0, y: 0},
		color: 'lightblue',
		offset: { x: 0, y: 0},
		bar: 1,
		imageSrc: playerSkin.idle.imageSrc,
		framesMax: playerSkin.idle.framesMax,
		scale: 2.5,
		img_offset: {x: 215, y: 180},
		sprites: {
			attack1: { imageSrc: playerSkin.attack1.imageSrc, framesMax: playerSkin.attack1.framesMax, time: playerSkin.attack1.time },
			attack2: { imageSrc: playerSkin.attack2.imageSrc, framesMax: playerSkin.attack2.framesMax, time: playerSkin.attack2.time },
			death: { imageSrc: playerSkin.death.imageSrc, framesMax: playerSkin.death.framesMax, time: playerSkin.death.time },
			fall: { imageSrc: playerSkin.fall.imageSrc, framesMax: playerSkin.fall.framesMax, time: playerSkin.fall.time },
			idle: { imageSrc: playerSkin.idle.imageSrc, framesMax: playerSkin.idle.framesMax, time: playerSkin.idle.time },
			jump: { imageSrc: playerSkin.jump.imageSrc, framesMax: playerSkin.jump.framesMax, time: playerSkin.jump.time },
			run: { imageSrc: playerSkin.run.imageSrc, framesMax: playerSkin.run.framesMax, time: playerSkin.run.time },
			hit: { imageSrc: playerSkin.hit.imageSrc, framesMax: playerSkin.hit.framesMax, time: stun_time / playerSkin.hit.framesMax },

			attack1Inv: { imageSrc: playerSkin.attack1Inv.imageSrc, framesMax: playerSkin.attack1Inv.framesMax, time: playerSkin.attack1Inv.time },
			attack2Inv: { imageSrc: playerSkin.attack2Inv.imageSrc, framesMax: playerSkin.attack2Inv.framesMax, time: playerSkin.attack2Inv.time },
			deathInv: { imageSrc: playerSkin.deathInv.imageSrc, framesMax: playerSkin.deathInv.framesMax, time: playerSkin.deathInv.time },
			fallInv: { imageSrc: playerSkin.fallInv.imageSrc, framesMax: playerSkin.fallInv.framesMax, time: playerSkin.fallInv.time },
			idleInv: { imageSrc: playerSkin.idleInv.imageSrc, framesMax: playerSkin.idleInv.framesMax, time: playerSkin.idleInv.time },
			jumpInv: { imageSrc: playerSkin.jumpInv.imageSrc, framesMax: playerSkin.jumpInv.framesMax, time: playerSkin.jumpInv.time },
			runInv: { imageSrc: playerSkin.runInv.imageSrc, framesMax: playerSkin.runInv.framesMax, time: playerSkin.runInv.time },
			hitInv: { imageSrc: playerSkin.hitInv.imageSrc, framesMax: playerSkin.hitInv.framesMax, time: stun_time / playerSkin.hitInv.framesMax },
		},
		hit_frame: 2,
		hit_frameInv: 0,
		facing : 'right',
	}),
	}
}

async function Matchmaking_init_skins(guy, skin_nbr)
{
	console.log('settings skins for ', skin_nbr)
	if (skin_nbr == undefined)
		return ;
	guy.sprites = {
		attack1: { imageSrc: window.game2Skins[skin_nbr].attack1.imageSrc,framesMax: window.game2Skins[skin_nbr].attack1.framesMax, time: window.game2Skins[skin_nbr].attack1.time },
		attack2: { imageSrc: window.game2Skins[skin_nbr].attack2.imageSrc, framesMax: window.game2Skins[skin_nbr].attack2.framesMax, time: window.game2Skins[skin_nbr].attack2.time },
		death: { imageSrc: window.game2Skins[skin_nbr].death.imageSrc, framesMax: window.game2Skins[skin_nbr].death.framesMax, time: window.game2Skins[skin_nbr].death.time },
		fall: { imageSrc: window.game2Skins[skin_nbr].fall.imageSrc, framesMax: window.game2Skins[skin_nbr].fall.framesMax, time: window.game2Skins[skin_nbr].fall.time },
		idle: { imageSrc: window.game2Skins[skin_nbr].idle.imageSrc, framesMax: window.game2Skins[skin_nbr].idle.framesMax, time: window.game2Skins[skin_nbr].idle.time },
		jump: { imageSrc: window.game2Skins[skin_nbr].jump.imageSrc, framesMax: window.game2Skins[skin_nbr].jump.framesMax, time: window.game2Skins[skin_nbr].jump.time },
		run: { imageSrc: window.game2Skins[skin_nbr].run.imageSrc, framesMax: window.game2Skins[skin_nbr].run.framesMax, time: window.game2Skins[skin_nbr].run.time },
			hit: { imageSrc: window.game2Skins[skin_nbr].hit.imageSrc, framesMax: window.game2Skins[skin_nbr].hit.framesMax, time: stun_time / window.game2Skins[skin_nbr].hit.framesMax },

			attack1Inv: { imageSrc: window.game2Skins[skin_nbr].attack1Inv.imageSrc, framesMax: window.game2Skins[skin_nbr].attack1Inv.framesMax, time: window.game2Skins[skin_nbr].attack1Inv.time },
			attack2Inv: { imageSrc: window.game2Skins[skin_nbr].attack2Inv.imageSrc, framesMax: window.game2Skins[skin_nbr].attack2Inv.framesMax, time: window.game2Skins[skin_nbr].attack2Inv.time },
			deathInv: { imageSrc: window.game2Skins[skin_nbr].deathInv.imageSrc, framesMax: window.game2Skins[skin_nbr].deathInv.framesMax, time: window.game2Skins[skin_nbr].deathInv.time },
			fallInv: { imageSrc: window.game2Skins[skin_nbr].fallInv.imageSrc, framesMax: window.game2Skins[skin_nbr].fallInv.framesMax, time: window.game2Skins[skin_nbr].fallInv.time },
			idleInv: { imageSrc: window.game2Skins[skin_nbr].idleInv.imageSrc, framesMax: window.game2Skins[skin_nbr].idleInv.framesMax, time: window.game2Skins[skin_nbr].idleInv.time },
			jumpInv: { imageSrc: window.game2Skins[skin_nbr].jumpInv.imageSrc, framesMax: window.game2Skins[skin_nbr].jumpInv.framesMax, time: window.game2Skins[skin_nbr].jumpInv.time },
			runInv: { imageSrc: window.game2Skins[skin_nbr].runInv.imageSrc, framesMax: window.game2Skins[skin_nbr].runInv.framesMax, time: window.game2Skins[skin_nbr].runInv.time },
			hitInv: { imageSrc: window.game2Skins[skin_nbr].hitInv.imageSrc, framesMax: window.game2Skins[skin_nbr].hitInv.framesMax, time: stun_time / window.game2Skins[skin_nbr].hitInv.framesMax },
	}
}

function Matchmaking_setup_canvas(v)
{
	v.g.canvas = document.getElementById('game2-area')
	v.g.c = v.g.canvas.getContext('2d')
	v.g.canvas.width = v.g.canvas_width
	v.g.canvas.height = v.g.canvas_height

	v.g.timer = document.querySelector('#game2-timer')
	v.g.time = parseInt(v.g.timer.innerHTML)
}

function Matchmaking_reset_keys(v) {
	v.keys.d.pressed = false
	v.keys.a.pressed = false
	v.keys.w.pressed = false
	
	v.keys.ArrowRight.pressed = false
	v.keys.ArrowLeft.pressed = false
	v.keys.ArrowUp.pressed = false
}

function Matchmaking_leave_game(v) {
	console.log('hashchange game2');

	clearInterval(v.g.gameInterval)
	clearInterval(v.g.timerInterval)
	clearInterval(v.g.backgroundInterval)
	clearInterval(v.s.socketupdate)

	window.removeEventListener('keydown', Matchmaking_game2_keydown)
	window.removeEventListener('keyup', Matchmaking_game2_keyup)
	window.removeEventListener('hashchange', Matchmaking_game2_hashchange)

	v.g.timer.innerHTML = 200

	v.s.game_socket.close()
	v.s.queue_socket.close()

	document.getElementById('div-game2-area').classList.add("hidden");
	document.getElementById('games').classList.add("hidden");
	unloadScripts(window.matchmakingScripts);

}