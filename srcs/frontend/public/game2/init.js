function init_vars() {

    return {

        background: new Sprite({
            position: { x: 0, y: 0 },
            imageSrc: background.path,
            scale: background.scale,
            framesMax: background.framesMax
        }),

        shop: new Sprite({
            position: { x: 800, y: 320 },
            imageSrc: shop.path,
            scale: shop.scale,
            framesMax: shop.framesMax
        }),
        
        player: new Fighter({
            name: 'player',
            position: { x: canvas.width / 4, y: canvas.height - ground_height + 250},
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
            facing : 'right',
        }),
        
        enemy: new Fighter({
            name: 'enemy',
            position : { x: canvas.width * 3 / 4, y: canvas.height - ground_height + 250},
            velocity: { x: 0, y: 0},
            color: 'white',
            offset: { x: -50, y: 0},
            bar: 2,
            imageSrc: Samu.idle.imageSrc,
            framesMax: Samu.idle.framesMax,
            scale: 2.5,
            img_offset: {x: 215, y: 165},
            sprites: {
                attack1: {imageSrc: Samu.attack1.imageSrc, framesMax: Samu.attack1.framesMax, time: Samu.attack1.time},
                attack2: {imageSrc: Samu.attack2.imageSrc, framesMax: Samu.attack2.framesMax, time: Samu.attack2.time},
                death: {imageSrc: Samu.death.imageSrc, framesMax: Samu.death.framesMax, time: Samu.death.time},
                fall: {imageSrc: Samu.fall.imageSrc, framesMax: Samu.fall.framesMax, time: Samu.fall.time},
                idle: {imageSrc: Samu.idle.imageSrc, framesMax: Samu.idle.framesMax, time: Samu.idle.time},
                jump: {imageSrc: Samu.jump.imageSrc, framesMax: Samu.jump.framesMax, time: Samu.jump.time},
                run: {imageSrc: Samu.run.imageSrc, framesMax: Samu.run.framesMax, time: Samu.run.time},
                hit: {imageSrc: Samu.hit.imageSrc, framesMax: Samu.hit.framesMax, time: Samu.hit.time},

                attack1Inv: {imageSrc: Samu.attack1Inv.imageSrc, framesMax: Samu.attack1Inv.framesMax, time: Samu.attack1Inv.time},
                attack2Inv: {imageSrc: Samu.attack2Inv.imageSrc, framesMax: Samu.attack2Inv.framesMax, time: Samu.attack2Inv.time},
                deathInv: {imageSrc: Samu.deathInv.imageSrc, framesMax: Samu.deathInv.framesMax, time: Samu.deathInv.time},
                fallInv: {imageSrc: Samu.fallInv.imageSrc, framesMax: Samu.fallInv.framesMax, time: Samu.fallInv.time},
                idleInv: {imageSrc: Samu.idleInv.imageSrc, framesMax: Samu.idleInv.framesMax, time: Samu.idleInv.time},
                jumpInv: {imageSrc: Samu.jumpInv.imageSrc, framesMax: Samu.jumpInv.framesMax, time: Samu.jumpInv.time},
                runInv: {imageSrc: Samu.runInv.imageSrc, framesMax: Samu.runInv.framesMax, time: Samu.runInv.time},
                hitInv: {imageSrc: Samu.hitInv.imageSrc, framesMax: Samu.hitInv.framesMax, time: Samu.hitInv.time},

            },
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
            canvas_width: 1366,
            canvas_height: 768,
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