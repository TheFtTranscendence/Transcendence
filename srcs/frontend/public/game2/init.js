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
            imageSrc: path_player_idle,
            framesMax: 4,
            scale: 2.5,
            img_offset: {x: 215, y: 180}
        }),
        
        enemy: new Fighter({
            name: 'enemy',
            position : { x: canvas.width * 3 / 4, y: canvas.height - ground_height + 250},
            velocity: { x: 0, y: 0},
            color: 'white',
            offset: { x: -50, y: 0},
            bar: 2,
            imageSrc: path_enemy_idle,
            framesMax: 8,
            scale: 2.5,
            img_offset: {x: 215, y: 165}
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