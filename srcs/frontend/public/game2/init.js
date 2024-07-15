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
            imageSrc: Mask.idle.imageSrc,
            framesMax: Mask.idle.framesMax,
            scale: 2.5,
            img_offset: {x: 215, y: 180},
            sprites: {
                attack1: {imageSrc: Mask.attack1.imageSrc, framesMax: Mask.attack1.framesMax, time: Mask.attack1.time},
                attack2: {imageSrc: Mask.attack2.imageSrc, framesMax: Mask.attack2.framesMax, time: Mask.attack2.time},
                death: {imageSrc: Mask.death.imageSrc, framesMax: Mask.death.framesMax, time: Mask.death.time},
                fall: {imageSrc: Mask.fall.imageSrc, framesMax: Mask.fall.framesMax, time: Mask.fall.time},
                idle: {imageSrc: Mask.idle.imageSrc, framesMax: Mask.idle.framesMax, time: Mask.idle.time},
                jump: {imageSrc: Mask.jump.imageSrc, framesMax: Mask.jump.framesMax, time: Mask.jump.time},
                run: {imageSrc: Mask.run.imageSrc, framesMax: Mask.run.framesMax, time: Mask.run.time},
                hit: {imageSrc: Mask.hit.imageSrc, framesMax: Mask.hit.framesMax, time: Mask.hit.time},

                attack1Inv: {imageSrc: Mask.attack1Inv.imageSrc, framesMax: Mask.attack1Inv.framesMax, time: Mask.attack1Inv.time},
                attack2Inv: {imageSrc: Mask.attack2Inv.imageSrc, framesMax: Mask.attack2Inv.framesMax, time: Mask.attack2Inv.time},
                deathInv: {imageSrc: Mask.deathInv.imageSrc, framesMax: Mask.deathInv.framesMax, time: Mask.deathInv.time},
                fallInv: {imageSrc: Mask.fallInv.imageSrc, framesMax: Mask.fallInv.framesMax, time: Mask.fallInv.time},
                idleInv: {imageSrc: Mask.idleInv.imageSrc, framesMax: Mask.idleInv.framesMax, time: Mask.idleInv.time},
                jumpInv: {imageSrc: Mask.jumpInv.imageSrc, framesMax: Mask.jumpInv.framesMax, time: Mask.jumpInv.time},
                runInv: {imageSrc: Mask.runInv.imageSrc, framesMax: Mask.runInv.framesMax, time: Mask.runInv.time},
                hitInv: {imageSrc: Mask.hitInv.imageSrc, framesMax: Mask.hitInv.framesMax, time: Mask.hitInv.time},
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