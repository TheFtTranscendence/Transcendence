function init_vars(player1, player2, skins1, skins2, skinId1, skinId2, tournamentGame) {

    canvas_width = 1366
	canvas_height = 768
	stun_time = 150 // ms
	ground_height = 50 // px

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
            name: player1,
            position: { x: canvas_width / 4, y: canvas_height - ground_height + 250},
            velocity: { x: 0, y: 0},
            color: 'lightblue',
            offset: { x: 0, y: 0},
            bar: 1,
            imageSrc: skins1.idle.imageSrc,
            framesMax: skins1.idle.framesMax,
            scale: 2.5,
            img_offset: {x: 215, y: 180},
            sprites: {
				attack1: { imageSrc: skins1.attack1.imageSrc, framesMax: skins1.attack1.framesMax, time: skins1.attack1.time },
				attack2: { imageSrc: skins1.attack2.imageSrc, framesMax: skins1.attack2.framesMax, time: skins1.attack2.time },
				death: { imageSrc: skins1.death.imageSrc, framesMax: skins1.death.framesMax, time: skins1.death.time },
				fall: { imageSrc: skins1.fall.imageSrc, framesMax: skins1.fall.framesMax, time: skins1.fall.time },
				idle: { imageSrc: skins1.idle.imageSrc, framesMax: skins1.idle.framesMax, time: skins1.idle.time },
				jump: { imageSrc: skins1.jump.imageSrc, framesMax: skins1.jump.framesMax, time: skins1.jump.time },
				run: { imageSrc: skins1.run.imageSrc, framesMax: skins1.run.framesMax, time: skins1.run.time },
				hit: { imageSrc: skins1.hit.imageSrc, framesMax: skins1.hit.framesMax, time: stun_time / skins1.hit.framesMax },

				attack1Inv: { imageSrc: skins1.attack1Inv.imageSrc, framesMax: skins1.attack1Inv.framesMax, time: skins1.attack1Inv.time },
				attack2Inv: { imageSrc: skins1.attack2Inv.imageSrc, framesMax: skins1.attack2Inv.framesMax, time: skins1.attack2Inv.time },
				deathInv: { imageSrc: skins1.deathInv.imageSrc, framesMax: skins1.deathInv.framesMax, time: skins1.deathInv.time },
				fallInv: { imageSrc: skins1.fallInv.imageSrc, framesMax: skins1.fallInv.framesMax, time: skins1.fallInv.time },
				idleInv: { imageSrc: skins1.idleInv.imageSrc, framesMax: skins1.idleInv.framesMax, time: skins1.idleInv.time },
				jumpInv: { imageSrc: skins1.jumpInv.imageSrc, framesMax: skins1.jumpInv.framesMax, time: skins1.jumpInv.time },
				runInv: { imageSrc: skins1.runInv.imageSrc, framesMax: skins1.runInv.framesMax, time: skins1.runInv.time },
				hitInv: { imageSrc: skins1.hitInv.imageSrc, framesMax: skins1.hitInv.framesMax, time: stun_time / skins1.hitInv.framesMax },
			},
            hit_frame: 2,
            hit_frameInv: 0,
            facing : 'right',
        }),

        enemy: new Fighter({
            name: player2,
            position : { x: canvas_width * 3 / 4, y: canvas_height - ground_height + 250},
            velocity: { x: 0, y: 0},
            color: 'white',
            offset: { x: -50, y: 0},
            bar: 2,
            imageSrc: skins2.idleInv.imageSrc,
            framesMax: skins2.idleInv.framesMax,
            scale: 2.5,
            img_offset: {x: 215, y: 165},
            sprites: {
				attack1: { imageSrc: skins2.attack1.imageSrc, framesMax: skins2.attack1.framesMax, time: skins2.attack1.time },
				attack2: { imageSrc: skins2.attack2.imageSrc, framesMax: skins2.attack2.framesMax, time: skins2.attack2.time },
				death: { imageSrc: skins2.death.imageSrc, framesMax: skins2.death.framesMax, time: skins2.death.time },
				fall: { imageSrc: skins2.fall.imageSrc, framesMax: skins2.fall.framesMax, time: skins2.fall.time },
				idle: { imageSrc: skins2.idle.imageSrc, framesMax: skins2.idle.framesMax, time: skins2.idle.time },
				jump: { imageSrc: skins2.jump.imageSrc, framesMax: skins2.jump.framesMax, time: skins2.jump.time },
				run: { imageSrc: skins2.run.imageSrc, framesMax: skins2.run.framesMax, time: skins2.run.time },
				hit: { imageSrc: skins2.hit.imageSrc, framesMax: skins2.hit.framesMax, time: stun_time / skins2.hit.framesMax },

				attack1Inv: { imageSrc: skins2.attack1Inv.imageSrc, framesMax: skins2.attack1Inv.framesMax, time: skins2.attack1Inv.time },
				attack2Inv: { imageSrc: skins2.attack2Inv.imageSrc, framesMax: skins2.attack2Inv.framesMax, time: skins2.attack2Inv.time },
				deathInv: { imageSrc: skins2.deathInv.imageSrc, framesMax: skins2.deathInv.framesMax, time: skins2.deathInv.time },
				fallInv: { imageSrc: skins2.fallInv.imageSrc, framesMax: skins2.fallInv.framesMax, time: skins2.fallInv.time },
				idleInv: { imageSrc: skins2.idleInv.imageSrc, framesMax: skins2.idleInv.framesMax, time: skins2.idleInv.time },
				jumpInv: { imageSrc: skins2.jumpInv.imageSrc, framesMax: skins2.jumpInv.framesMax, time: skins2.jumpInv.time },
				runInv: { imageSrc: skins2.runInv.imageSrc, framesMax: skins2.runInv.framesMax, time: skins2.runInv.time },
				hitInv: { imageSrc: skins2.hitInv.imageSrc, framesMax: skins2.hitInv.framesMax, time: stun_time / skins2.hitInv.framesMax },
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

            tournamentGame: tournamentGame,
            skinId1: skinId1,
            skinId2: skinId2,

        }
    }
}

function setup_canvas(v)
{
    v.g.canvas = document.getElementById('game2-area')
	v.g.c = v.g.canvas.getContext('2d')
	v.g.canvas.width = v.g.canvas_width
	v.g.canvas.height = v.g.canvas_height

	v.g.timer = document.querySelector('#game2-timer')
	v.g.time = parseInt(v.g.timer.innerHTML)
}

function reset_keys(v) {
	v.keys.d.pressed = false
	v.keys.a.pressed = false
	v.keys.w.pressed = false

	v.keys.ArrowRight.pressed = false
	v.keys.ArrowLeft.pressed = false
	v.keys.ArrowUp.pressed = false

}

async function leave_game(v) {
	console.log('hashchange game2');

    console.log("WE HERE")

    clearInterval(v.g.gameInterval)
    clearInterval(v.g.timerInterval)
    clearInterval(v.g.backgroundInterval)

    await storeMatch(v)

    if (v.g.tournamentGame && fightyTournamentData.tournamentEnd)
    {
        fightyTournamentData.finalTournament = await getFinalTournamentFighty()
        window.storeTournamentBlockchainFighty()
    }


    v.player = null
    v.enemy = null
        
    window.removeEventListener('keydown', game2_keydown)
	window.removeEventListener('keyup', game2_keyup)
	window.removeEventListener('hashchange', game2_hashchange)

    window.addEventListener('keydown', quit);

}

async function quit(event)
{
    if (event.key === 'x' || event.key === 'X') {

        window.fightyGamesOnCounter--;
        v.g.timer.innerHTML = 200 
        
        document.querySelector('#game2-bar1').style.width = '100%'
        document.querySelector('#game2-bar2').style.width = '100%'

        document.querySelector('#game2-end-text').style.display = 'none'

        
        unloadScripts(window.game2Scripts);
        document.getElementById('div-game2-area').classList.add("hidden");
        if (v.g.tournamentGame) {
            await PromiseloadScripts(window.tournamentScripts);
            tournament_loop();
        }
        else {
            await PromiseloadScripts(window.menuScripts);
            main_menu();
        }
        window.removeEventListener('keydown', quit);
    }
}

async function storeMatch(v)
{
    players = [
        v.player.name,
        v.enemy.name,
    ]

    scores = [
        v.player.health,
        v.enemy.health,
    ]

	if (v.g.tournamentGame)
	{

        if (v.player.health > v.enemy.health) {
            fightyTournamentData.addGameWinner(v.player.name, v.g.skinId1)
        }
        else {
            fightyTournamentData.addGameWinner(v.enemy.name, v.g.skinId2)
        }

        fightyTournamentData.setMatchAsPlayed(players)

		const url = 'https://' + window.IP + ':3000/online-games/tournaments/' + fightyTournamentData.id + '/games/';

		const game = {
			"users": players,
			"scores": scores,
		}

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(game),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            const data = await response.json();
            if (data.status === "completed") {
                fightyTournamentData.tournamentEnd = true;
            }

        } catch (error) {
            throw new Error(error.message);
        }
	}
	else
	{
		const url = `https://${window.IP}:3000/solidity/solidity/addgame/${window.user.blockchain_id}/Fighty`;

		const data = {
			players: players,
			scores: scores,
		};

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
	}
}
