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
            img_offset: {x: 215, y: 180},
            sprites: {
                attack1: {imageSrc: path_player_attack1, framesMax: 4},
                attack2: {imageSrc: path_player_attack2, framesMax: 4},
                death: {imageSrc: path_player_death, framesMax: 7},
                fall: {imageSrc: path_player_fall, framesMax: 2},
                idle: {imageSrc: path_player_idle, framesMax: 4},
                jump: {imageSrc: path_player_jump, framesMax: 2},
                run: {imageSrc: path_player_run, framesMax: 8},
                hit: {imageSrc: path_player_hit, framesMax: 3}
            }
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
            img_offset: {x: 215, y: 165},
            sprites: {
                attack1: {imageSrc: path_enemy_attack1, framesMax: 6},
                attack2: {imageSrc: path_enemy_attack2, framesMax: 6},
                death: {imageSrc: path_enemy_death, framesMax: 6},
                fall: {imageSrc: path_enemy_fall, framesMax: 2},
                idle: {imageSrc: path_enemy_idle, framesMax: 8},
                jump: {imageSrc: path_enemy_jump, framesMax: 2},
                run: {imageSrc: path_enemy_run, framesMax: 8},
                hit: {imageSrc: path_enemy_hit, framesMax: 4}
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