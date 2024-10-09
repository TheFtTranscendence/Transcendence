function init_vars(player1, player2, skins1, skins2) {

    canvas_width = 1366
	canvas_height = 768
	stun_time = 150 // ms
	ground_height = 50 // px

    return {
        background: new Sprite({
            position: { x: 0, y: 0 },
            imageSrc: './game2/assets/background.png',
            scale: 1,
            framesMax: 1
        }),

        shop: new Sprite({
            position: { x: 800, y: 320 },
            imageSrc: './game2/assets/shop.png',
            scale: 3,
            framesMax: 6
        }),

        player: new Fighter({
            name: player1,
            position: { x: canvas_width / 4, y: canvas_height - ground_height + 250},
            velocity: { x: 0, y: 0},
            color: 'lightblue',
            offset: { x: 0, y: 0},
            bar: 1,
            imageSrc: skins1.normal.idle.imageSrc,
            framesMax: skins1.normal.idle.framesMax,
            scale: 2.5,
            img_offset: {x: 215, y: 180},
            sprites: {
				attack1: { imageSrc: skins1.normal.attack1.imageSrc, framesMax: skins1.normal.attack1.framesMax, time: skins1.normal.attack1.time },
				attack2: { imageSrc: skins1.normal.attack2.imageSrc, framesMax: skins1.normal.attack2.framesMax, time: skins1.normal.attack2.time },
				death: { imageSrc: skins1.normal.death.imageSrc, framesMax: skins1.normal.death.framesMax, time: skins1.normal.death.time },
				fall: { imageSrc: skins1.normal.fall.imageSrc, framesMax: skins1.normal.fall.framesMax, time: skins1.normal.fall.time },
				idle: { imageSrc: skins1.normal.idle.imageSrc, framesMax: skins1.normal.idle.framesMax, time: skins1.normal.idle.time },
				jump: { imageSrc: skins1.normal.jump.imageSrc, framesMax: skins1.normal.jump.framesMax, time: skins1.normal.jump.time },
				run: { imageSrc: skins1.normal.run.imageSrc, framesMax: skins1.normal.run.framesMax, time: skins1.normal.run.time },
				hit: { imageSrc: skins1.normal.hit.imageSrc, framesMax: skins1.normal.hit.framesMax, time: stun_time / skins1.normal.hit.framesMax },

				attack1Inv: { imageSrc: skins1.inverted.attack1.imageSrc, framesMax: skins1.inverted.attack1.framesMax, time: skins1.inverted.attack1.time },
				attack2Inv: { imageSrc: skins1.inverted.attack2.imageSrc, framesMax: skins1.inverted.attack2.framesMax, time: skins1.inverted.attack2.time },
				deathInv: { imageSrc: skins1.inverted.death.imageSrc, framesMax: skins1.inverted.death.framesMax, time: skins1.inverted.death.time },
				fallInv: { imageSrc: skins1.inverted.fall.imageSrc, framesMax: skins1.inverted.fall.framesMax, time: skins1.inverted.fall.time },
				idleInv: { imageSrc: skins1.inverted.idle.imageSrc, framesMax: skins1.inverted.idle.framesMax, time: skins1.inverted.idle.time },
				jumpInv: { imageSrc: skins1.inverted.jump.imageSrc, framesMax: skins1.inverted.jump.framesMax, time: skins1.inverted.jump.time },
				runInv: { imageSrc: skins1.inverted.run.imageSrc, framesMax: skins1.inverted.run.framesMax, time: skins1.inverted.run.time },
				hitInv: { imageSrc: skins1.inverted.hit.imageSrc, framesMax: skins1.inverted.hit.framesMax, time: stun_time / skins1.inverted.hit.framesMax },
			},
            hit_frame: 2,
            hit_frameInv: 0,
            facing : 'right',
        }),

        enemy: new Fighter({
            name: player2,
            position : { x: canvas_width * 3 / 4, y: canvas_height - ground_height + 250},
            velocity: { x: 0, y: 0},
            color: 'white',
            offset: { x: -50, y: 0},
            bar: 2,
            imageSrc: skins2.inverted.idle.imageSrc,
            framesMax: skins2.inverted.idle.framesMax,
            scale: 2.5,
            img_offset: {x: 215, y: 165},
            sprites: {
				attack1: { imageSrc: skins2.normal.attack1.imageSrc, framesMax: skins2.normal.attack1.framesMax, time: skins2.normal.attack1.time },
				attack2: { imageSrc: skins2.normal.attack2.imageSrc, framesMax: skins2.normal.attack2.framesMax, time: skins2.normal.attack2.time },
				death: { imageSrc: skins2.normal.death.imageSrc, framesMax: skins2.normal.death.framesMax, time: skins2.normal.death.time },
				fall: { imageSrc: skins2.normal.fall.imageSrc, framesMax: skins2.normal.fall.framesMax, time: skins2.normal.fall.time },
				idle: { imageSrc: skins2.normal.idle.imageSrc, framesMax: skins2.normal.idle.framesMax, time: skins2.normal.idle.time },
				jump: { imageSrc: skins2.normal.jump.imageSrc, framesMax: skins2.normal.jump.framesMax, time: skins2.normal.jump.time },
				run: { imageSrc: skins2.normal.run.imageSrc, framesMax: skins2.normal.run.framesMax, time: skins2.normal.run.time },
				hit: { imageSrc: skins2.normal.hit.imageSrc, framesMax: skins2.normal.hit.framesMax, time: stun_time / skins2.normal.hit.framesMax },

				attack1Inv: { imageSrc: skins2.inverted.attack1.imageSrc, framesMax: skins2.inverted.attack1.framesMax, time: skins2.inverted.attack1.time },
				attack2Inv: { imageSrc: skins2.inverted.attack2.imageSrc, framesMax: skins2.inverted.attack2.framesMax, time: skins2.inverted.attack2.time },
				deathInv: { imageSrc: skins2.inverted.death.imageSrc, framesMax: skins2.inverted.death.framesMax, time: skins2.inverted.death.time },
				fallInv: { imageSrc: skins2.inverted.fall.imageSrc, framesMax: skins2.inverted.fall.framesMax, time: skins2.inverted.fall.time },
				idleInv: { imageSrc: skins2.inverted.idle.imageSrc, framesMax: skins2.inverted.idle.framesMax, time: skins2.inverted.idle.time },
				jumpInv: { imageSrc: skins2.inverted.jump.imageSrc, framesMax: skins2.inverted.jump.framesMax, time: skins2.inverted.jump.time },
				runInv: { imageSrc: skins2.inverted.run.imageSrc, framesMax: skins2.inverted.run.framesMax, time: skins2.inverted.run.time },
				hitInv: { imageSrc: skins2.inverted.hit.imageSrc, framesMax: skins2.inverted.hit.framesMax, time: stun_time / skins2.inverted.hit.framesMax },
			},
            hit_frame: 1,
            hit_frameInv: 1,
            facing : 'left',
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

			backgroundMusic: 0,
        }
    }
}

function setup_canvas(v)
{
    v.g.canvas = document.getElementById('game2-area')
	v.g.c = v.g.canvas.getContext('2d')
	v.g.canvas.width = v.g.canvas_width
	v.g.canvas.height = v.g.canvas_height

	v.g.timer = document.querySelector('#game2-timer')
	v.g.time = parseInt(v.g.timer.innerHTML)
}

function setup_music(v) {
	v.g.backgroundMusic = new Audio('./game2/assets/background.mp3')
	v.g.backgroundMusic.loop = true;
	v.g.backgroundMusic.volume = 0.02;
}

function reset_keys(v) {
	v.keys.d.pressed = false
	v.keys.a.pressed = false
	v.keys.w.pressed = false

	v.keys.ArrowRight.pressed = false
	v.keys.ArrowLeft.pressed = false
	v.keys.ArrowUp.pressed = false

}

function leave_game(v) {
	console.log('hashchange game2');

    clearInterval(v.g.gameInterval)
    clearInterval(v.g.timerInterval)
    clearInterval(v.g.backgroundInterval)

    window.removeEventListener('keydown', game2_keydown)
	window.removeEventListener('keyup', game2_keyup)
	window.removeEventListener('hashchange', game2_hashchange)

	try {
		v.g.backgroundMusic.pause()
		v.g.backgroundMusic = null
	}
	catch {}

	v.g.timer.innerHTML = 50

	document.getElementById('div-game2-area').classList.add("hidden");
	document.getElementById('game2-menu').classList.add("hidden");
	document.getElementById('game2').classList.add("hidden");
	unloadScripts(window.game2Scripts);

	document.getElementById('game2').classList.add("hidden");
	unloadScripts(window.game2Scripts);

}
