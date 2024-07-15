const canvas_width = 1366
const canvas_height = 768
 
const fps = 100
 
const gravity = 0.5 // px
const drag = .50 // px
const knockback = 25 // px
const ground_height = 50 // px
const stun_time = 150 // ms
const hit_dmg = 50 // %
 
const background = { path: './game2/assets/background.png', scale: 1, framesMax: 1 }
const shop = {path: './game2/assets/shop.png', scale: 3, framesMax: 6, time: 10}

const Mask = {
	hit_frame: 2,
    attack1: { imageSrc: './game2/assets/Mask/Sprites/Attack1.png', framesMax: 4, time: 15},
    attack2: { imageSrc: './game2/assets/Mask/Sprites/Attack2.png', framesMax: 4, time: 15},
    death: { imageSrc: './game2/assets/Mask/Sprites/Death.png', framesMax: 7, time: 10},
    fall: { imageSrc: './game2/assets/Mask/Sprites/Fall.png', framesMax: 2, time: 10},
    idle: { imageSrc: './game2/assets/Mask/Sprites/Idle.png', framesMax: 4, time: 10},
    jump: { imageSrc: './game2/assets/Mask/Sprites/Jump.png', framesMax: 2, time: 10},
    run: { imageSrc: './game2/assets/Mask/Sprites/Run.png', framesMax: 8, time: 10},
    hit: { imageSrc: './game2/assets/Mask/Sprites/TakeHit-silhouette.png', framesMax: 4, time: stun_time / 4},
}


const Samu = {
	hit_frame: 0,
    attack1: { imageSrc: './game2/assets/Samu/Sprites/Attack1.png', framesMax: 4, time: 15},
    attack2: { imageSrc: './game2/assets/Samu/Sprites/Attack2.png', framesMax: 4, time: 15},
    death: { imageSrc: './game2/assets/Samu/Sprites/Death.png', framesMax: 6, time: 10},
    fall: { imageSrc: './game2/assets/Samu/Sprites/Fall.png', framesMax: 2, time: 10},
    idle: { imageSrc: './game2/assets/Samu/Sprites/Idle.png', framesMax: 8, time: 10},
    jump: { imageSrc: './game2/assets/Samu/Sprites/Jump.png', framesMax: 2, time: 10},
    run: { imageSrc: './game2/assets/Samu/Sprites/Run.png', framesMax: 8, time: 10},
    hit: { imageSrc: './game2/assets/Samu/Sprites/Take-Hit-white-silhouette.png', framesMax: 4, time: stun_time / 4},
}