function init_vars(canvas_width, canvas_height, stun_time, ground_height) {

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
            name: 'player',
            position: { x: canvas_width / 4, y: canvas_height - ground_height + 250},
            velocity: { x: 0, y: 0},
            color: 'lightblue',
            offset: { x: 0, y: 0},
            bar: 1,
            imageSrc: './game2/assets/Mask/Sprites/normal/Idle.png',
            framesMax: 4,
            scale: 2.5,
            img_offset: {x: 215, y: 180},
            sprites: {
                attack1: {imageSrc: './game2/assets/Mask/Sprites/normal/Attack1.png', framesMax: 4, time: 15},
                attack2: {imageSrc: './game2/assets/Mask/Sprites/normal/Attack2.png', framesMax: 4, time: 15},
                death: {imageSrc:'./game2/assets/Mask/Sprites/normal/Death.png', framesMax: 7, time: 10},
                fall: {imageSrc: './game2/assets/Mask/Sprites/normal/Fall.png', framesMax: 2, time: 10},
                idle: {imageSrc: './game2/assets/Mask/Sprites/normal/Idle.png', framesMax: 4, time: 10},
                jump: {imageSrc: './game2/assets/Mask/Sprites/normal/Jump.png', framesMax: 2, time: 10},
                run: {imageSrc: './game2/assets/Mask/Sprites/normal/Run.png', framesMax: 8, time: 10},
                hit: {imageSrc: './game2/assets/Mask/Sprites/normal/TakeHit-silhouette.png', framesMax: 4, time: stun_time / 4},

                attack1Inv: {imageSrc: './game2/assets/Mask/Sprites/inverted/Attack1.png', framesMax: 4, time: 15},
                attack2Inv: {imageSrc: './game2/assets/Mask/Sprites/inverted/Attack2.png', framesMax: 4, time: 15},
                deathInv: {imageSrc:'./game2/assets/Mask/Sprites/inverted/Death.png', framesMax: 7, time: 10},
                fallInv: {imageSrc: './game2/assets/Mask/Sprites/inverted/Fall.png', framesMax: 2, time: 10},
                idleInv: {imageSrc: './game2/assets/Mask/Sprites/inverted/Idle.png', framesMax: 4, time: 10},
                jumpInv: {imageSrc: './game2/assets/Mask/Sprites/inverted/Jump.png', framesMax: 2, time: 10},
                runInv: {imageSrc: './game2/assets/Mask/Sprites/inverted/Run.png', framesMax: 8, time: 10},
                hitInv: {imageSrc: './game2/assets/Mask/Sprites/inverted/TakeHit-silhouette.png', framesMax: 4, time: stun_time / 4},
            },
            hit_frame: 2,
            hit_frameInv: 0,
            facing : 'right',
        }),
        
        enemy: new Fighter({
            name: 'enemy',
            position : { x: canvas_width * 3 / 4, y: canvas_height - ground_height + 250},
            velocity: { x: 0, y: 0},
            color: 'white',
            offset: { x: -50, y: 0},
            bar: 2,
            imageSrc: './game2/assets/Samu/Sprites/normal/Idle.png',
            framesMax: 8,
            scale: 2.5,
            img_offset: {x: 215, y: 165},
            sprites: {
                attack1: {imageSrc: './game2/assets/Samu/Sprites/normal/Attack1.png', framesMax: 4, time: 15},
                attack2: {imageSrc: './game2/assets/Samu/Sprites/normal/Attack2.png', framesMax: 4, time: 15},
                death: {imageSrc:'./game2/assets/Samu/Sprites/normal/Death.png', framesMax: 6, time: 10},
                fall: {imageSrc: './game2/assets/Samu/Sprites/normal/Fall.png', framesMax: 2, time: 10},
                idle: {imageSrc: './game2/assets/Samu/Sprites/normal/Idle.png', framesMax: 8, time: 10},
                jump: {imageSrc: './game2/assets/Samu/Sprites/normal/Jump.png', framesMax: 2, time: 10},
                run: {imageSrc: './game2/assets/Samu/Sprites/normal/Run.png', framesMax: 8, time: 10},
                hit: {imageSrc: './game2/assets/Samu/Sprites/normal/Take-Hit-white-silhouette.png', framesMax: 4, time: stun_time / 4},

                attack1Inv: {imageSrc: './game2/assets/Samu/Sprites/inverted/Attack1.png', framesMax: 4, time: 15},
                attack2Inv: {imageSrc: './game2/assets/Samu/Sprites/inverted/Attack2.png', framesMax: 4, time: 15},
                deathInv: {imageSrc:'./game2/assets/Samu/Sprites/inverted/Death.png', framesMax: 6, time: 10},
                fallInv: {imageSrc: './game2/assets/Samu/Sprites/inverted/Fall.png', framesMax: 2, time: 10},
                idleInv: {imageSrc: './game2/assets/Samu/Sprites/inverted/Idle.png', framesMax: 8, time: 10},
                jumpInv: {imageSrc: './game2/assets/Samu/Sprites/inverted/Jump.png', framesMax: 2, time: 10},
                runInv: {imageSrc: './game2/assets/Samu/Sprites/inverted/Run.png', framesMax: 8, time: 10},
                hitInv: {imageSrc: './game2/assets/Samu/Sprites/inverted/Take-Hit-white-silhouette.png', framesMax: 4, time: stun_time / 4},
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
        }
    }
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

    console.log('fps = ' + v.g.fps)

    clearInterval(v.g.gameInterval)
    clearInterval(v.g.timerInterval)
    clearInterval(v.g.backgroundInterval)
        
	
	document.querySelector('#game2-end-text').style.display = 'none'
    v.g.timer.innerHTML = 50
        
    reset_keys(v)
    v = 0
}