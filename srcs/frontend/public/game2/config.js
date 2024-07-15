const canvas_width = 1366
const canvas_height = 768
 
const fps = 100
 
const gravity = 0.5 // px
const drag = .50 // px
const knockback = 25 // px
const ground_height = 50 // px
const stun_time = 150 // ms
const hit_dmg = 100 // %
 
const background = { path: './game2/assets/background.png', scale: 1, framesMax: 1 }
const shop = {path: './game2/assets/shop.png', scale: 3, framesMax: 6, time: 10}

const Mask = {
	hit_frame: 3,
    hit_frameInv: 2,
    attack1: { imageSrc: './game2/assets/Mask/Sprites/normal/Attack1.png', framesMax: 4, time: 15},
    attack2: { imageSrc: './game2/assets/Mask/Sprites/normal/Attack2.png',framesMax: 4, time: 15},
    death: { imageSrc: './game2/assets/Mask/Sprites/normal/Death.png', framesMax: 7, time: 10},
    fall: { imageSrc: './game2/assets/Mask/Sprites/normal/Fall.png',framesMax: 2, time: 10},
    idle: { imageSrc: './game2/assets/Mask/Sprites/normal/Idle.png',framesMax: 4, time: 10},
    jump: { imageSrc: './game2/assets/Mask/Sprites/normal/Jump.png',framesMax: 2, time: 10},
    run: { imageSrc: './game2/assets/Mask/Sprites/normal/Run.png',framesMax: 8, time: 10},
    hit: { imageSrc: './game2/assets/Mask/Sprites/normal/TakeHit-silhouette.png' ,framesMax: 4, time: stun_time / 4},

    attack1Inv: { imageSrc: './game2/assets/Mask/Sprites/inverted/Attack1.png', framesMax: 4, time: 15},
    attack2Inv: { imageSrc: './game2/assets/Mask/Sprites/inverted/Attack2.png', framesMax: 4, time: 15},
    deathInv: { imageSrc: './game2/assets/Mask/Sprites/inverted/Death.png', framesMax: 7, time: 10},
    fallInv: { imageSrc: './game2/assets/Mask/Sprites/inverted/Fall.png', framesMax: 2, time: 10},
    idleInv: { imageSrc: './game2/assets/Mask/Sprites/inverted/Idle.png', framesMax: 4, time: 10},
    jumpInv: { imageSrc: './game2/assets/Mask/Sprites/inverted/Jump.png', framesMax: 2, time: 10},
    runInv: { imageSrc: './game2/assets/Mask/Sprites/inverted/Run.png', framesMax: 8, time: 10},
    hitInv: { imageSrc: './game2/assets/Mask/Sprites/inverted/TakeHit-silhouette.png', framesMax: 4, time: stun_time / 4},
}

const Samu = {
    hit_frame: 1,
    hit_frameInv: 1,
    attack1: { imageSrc: './game2/assets/Samu/Sprites/normal/Attack1.png', framesMax: 4, time: 15},
    attack2: { imageSrc: './game2/assets/Samu/Sprites/normal/Attack2.png', framesMax: 4, time: 15},
    death: { imageSrc: './game2/assets/Samu/Sprites/normal/Death.png', framesMax: 6, time: 10},
    fall: { imageSrc: './game2/assets/Samu/Sprites/normal/Fall.png', framesMax: 2, time: 10},
    idle: { imageSrc: './game2/assets/Samu/Sprites/normal/Idle.png', framesMax: 8, time: 10},
    jump: { imageSrc: './game2/assets/Samu/Sprites/normal/Jump.png', framesMax: 2, time: 10},
    run: { imageSrc: './game2/assets/Samu/Sprites/normal/Run.png', framesMax: 8, time: 10},
    hit: { imageSrc: './game2/assets/Samu/Sprites/normal/Take-Hit-white-silhouette.png', framesMax: 4, time: stun_time / 4},

    attack1Inv: { imageSrc: './game2/assets/Samu/Sprites/inverted/Attack1.png', framesMax: 4, time: 15},
    attack2Inv: { imageSrc: './game2/assets/Samu/Sprites/inverted/Attack2.png', framesMax: 4, time: 15},
    deathInv: { imageSrc: './game2/assets/Samu/Sprites/inverted/Death.png', framesMax: 6, time: 10},
    fallInv: { imageSrc: './game2/assets/Samu/Sprites/inverted/Fall.png', framesMax: 2, time: 10},
    idleInv: { imageSrc: './game2/assets/Samu/Sprites/inverted/Idle.png', framesMax: 8, time: 10},
    jumpInv: { imageSrc: './game2/assets/Samu/Sprites/inverted/Jump.png', framesMax: 2, time: 10},
    runInv: { imageSrc: './game2/assets/Samu/Sprites/inverted/Run.png', framesMax: 8, time: 10},
    hitInv: { imageSrc: './game2/assets/Samu/Sprites/inverted/Take-Hit-white-silhouette.png', framesMax: 4, time: stun_time / 4},
}
