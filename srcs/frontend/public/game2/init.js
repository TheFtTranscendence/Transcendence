function init_vars() {

    return {

        background: new Sprite({
            position: { x: 0, y: 0 },
            imageSrc: path_background,
            scale: 1,
            framesMax: 1
        }),

        shop: new Sprite({
            position: { x: 800, y: 320 },
            imageSrc: path_shop,
            scale: 3,
            framesMax: 6
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
                hit: {imageSrc: Mask.hit.imageSrc, framesMax: Mask.hit.framesMax, time: Mask.hit.time}
            }
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
                hit: {imageSrc: Samu.hit.imageSrc, framesMax: Samu.hit.framesMax, time: Samu.hit.time}
            }
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