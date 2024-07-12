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
            position: { x: canvas.width / 4, y: canvas.height - 150},
            velocity: { x: 0, y: 0},
            color: 'lightblue',
            offset: { x: 0, y: 0},
            bar: 1
        }),
        
        enemy: new Fighter({
            name: 'enemy',
            position : { x: canvas.width * 3 / 4, y: canvas.height - 150},
            velocity: { x: 0, y: 0},
            color: 'white',
            offset: { x: -50, y: 0},
            bar: 2
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