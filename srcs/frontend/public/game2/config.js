const canvas_width = 1366
const canvas_height = 768

const gravity = 0.5
const drag = .50
const knockback = 25
const fps = 100
const ground_height = 50
const stun_time = 150

const path_background = './game2/assets/background.png'
const path_shop = './game2/assets/shop.png'

const Mask = {
    attack1: { imageSrc: './game2/assets/Mask/Sprites/Attack1.png', framesMax: 4, time: 15},
    attack2: { imageSrc: './game2/assets/Mask/Sprites/Attack2.png', framesMax: 4, time: 15},
    death: { imageSrc: './game2/assets/Mask/Sprites/Death.png', framesMax: 7, time: 10},
    fall: { imageSrc: './game2/assets/Mask/Sprites/Fall.png', framesMax: 2, time: 10},
    idle: { imageSrc: './game2/assets/Mask/Sprites/Idle.png', framesMax: 4, time: 10},
    jump: { imageSrc: './game2/assets/Mask/Sprites/Jump.png', framesMax: 2, time: 10},
    run: { imageSrc: './game2/assets/Mask/Sprites/Run.png', framesMax: 8, time: 10},
    hit: { imageSrc: './game2/assets/Mask/Sprites/TakeHit.png', framesMax: 4, time: stun_time / 4},
}


const Samu = {
    attack1: { imageSrc: './game2/assets/Samu/Sprites/Attack1.png', framesMax: 4, time: 20},
    attack2: { imageSrc: './game2/assets/Samu/Sprites/Attack2.png', framesMax: 4, time: 20},
    death: { imageSrc: './game2/assets/Samu/Sprites/Death.png', framesMax: 6, time: 10},
    fall: { imageSrc: './game2/assets/Samu/Sprites/Fall.png', framesMax: 2, time: 10},
    idle: { imageSrc: './game2/assets/Samu/Sprites/Idle.png', framesMax: 8, time: 10},
    jump: { imageSrc: './game2/assets/Samu/Sprites/Jump.png', framesMax: 2, time: 10},
    run: { imageSrc: './game2/assets/Samu/Sprites/Run.png', framesMax: 8, time: 10},
    hit: { imageSrc: './game2/assets/Samu/Sprites/TakeHit.png', framesMax: 4, time: stun_time / 4},
}