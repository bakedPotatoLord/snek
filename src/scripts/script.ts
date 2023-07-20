import Cookies from 'js-cookie'
import { DefineComponent } from 'vue';
import { createAudio, createImage } from './functions.js'
//images
import bImg from '../assets/images/background.png'
import dirtImg from '../assets/images/dirt.png'
import heartImg from '../assets/images/heart.png'
import mouseImg from '../assets/images/mouse.png'
import pauseImg from '../assets/images/pause.png'
import playImg from '../assets/images/play.png'
import resetImgString from '../assets/images/reset.png'
import rockImg from '../assets/images/rock.png'

//audio
import eat from '../assets/audio/eat.wav';
import pauseAudio from '../assets/audio/pause.mp3';
import theme1 from '../assets/audio/theme1.mp3';

//game objects

import Eagle from './Eagle.js';
import Snek from './Snek.js';

let eagle: Eagle
let snek: Snek

let c: HTMLCanvasElement
let ctx: CanvasRenderingContext2D

function err(): never {
	throw new Error("error");
}

if (Cookies.get('highscore') == undefined) {
	Cookies.set('highscore', "0");
};

export const game = {
	startTime: Date.now(),
	paused: false,
	rect: [],
	over: false,
	startPage: true,
	bImg: createImage(bImg),
}

const mouse = {
	'image': createImage(mouseImg),
	'rotation': 0,
	'anim': 0,
	'height': 20,
	location:[20 + Math.floor(Math.random() * 28) * 20, 20 + Math.floor(Math.random() * 18) * 20]
}

const pause = {
	'image': createImage(pauseImg),
	'x': 566,
	'y': 4
}

const resetImg = {
	'image': createImage(resetImgString),
	'x': 530,
	'y': 4
}

const play = {
	'image': createImage(playImg),
	'x': 236,
	'y': 150,
}

const heart = {
	'image': createImage(heartImg),
}

const dirt = {
	'image': createImage(dirtImg),
	'x': 0,
	'y': 0,
	'anim': 0,
	'animating': true,
}

export const audio = {
	'eat': createAudio(eat),
	'pauseAudio': createAudio(pauseAudio),
	'theme1': createAudio(theme1),

}

const rock = {
	image: createImage(rockImg),
	arr: <any[]>[],
	num: 0
}

let cw: number
let ch: number

mouse.rotation = Math.floor(Math.random() * 4);

let gameActive = true;

function reset() {
	snek.reset()
	game.startTime = Date.now();
	gameActive = true;
	//reset mouse and eagle
	eagle.reset()
	game.paused = false;
	game.startPage = false;
	game.over = false
};

function lifeReset() {
	

	//reset mouse and eagle
	resetFood()
	eagle.reset()
	snek.lifereset()
	resetRock();
	snek.life -= 1;
}

function resetFood() {
	mouse.location = [Math.floor(Math.random() * 28) * 20 + 20, Math.floor(Math.random() * 18) * 20 + 20]
}

function resetRock() {
	rock.arr = []
	rock.num = Math.floor(Math.random() * 10) + 5;
	for (var i = 0; i < rock.num; i++) {
		rock.arr.push([Math.floor(Math.random() * 28) * 20 + 20, Math.floor(Math.random() * 17) * 20 + 40]);
	};
	for (var i = 0; i < rock.num; i++) {
		if (rock.arr[i][1] == 200) {
			rock.arr[i][1] += 20
		}
	};
}

function secsToMins(sec: number) {
	let i = 0;
	while (sec >= 60) {
		sec -= 60;
		i += 1;
	};
	if (sec > 9) {
		return 'Survival time ' + i + ':' + sec;
	} else {
		return 'Survival time ' + i + ':0' + sec;
	}
}

function foodDistance() {
	return Math.sqrt(Math.abs(snek.pArr[0][0] - mouse.location[0]) ** 2 + Math.abs(snek.pArr[0][1] - mouse.location[1]) ** 2)
}

function isAlive() {
	return snek.pArr[0][0] > 0 && snek.pArr[0][0] < cw - 20 && snek.pArr[0][1] > 20 && snek.pArr[0][1] < ch - 20
};

function logKey(event: KeyboardEvent) {
	event.preventDefault()
	console.log(event.code)
	if ((event.key == 'w' || event.code == 'ArrowUp') && snek.displayDirection != 180) {
		snek.direction = 0;
	} else if ((event.key == 'd' || event.code == 'ArrowRight') && snek.displayDirection != 270) {
		snek.direction = 90;
	} else if ((event.key == 's' || event.code == 'ArrowDown') && snek.displayDirection != 0) {
		snek.direction = 180;
	} else if ((event.key == 'a' || event.code == 'ArrowLeft') && snek.displayDirection != 90) {
		snek.direction = 270;
	};
}

// must factor in game.paused == false && game.startPage == false
function gameOn() {
	if (gameActive) {
		if (game.paused || game.startPage) {
			return false;
		}
		if (isAlive() && snek.checkBodyCollision() && !snek.checkEagleCollision(eagle) && !snek.checkRockCollision(rock)) {
			return true;
		} else {
			if (snek.life > 1) {
				lifeReset();
				console.log('lives  ' + snek.life)
				return true;
			} else {
				game.over = true;
			}
		};
	}
};

function eagleLoop() {
	if (gameOn()) {
		eagle.anim = eagle.anim + 1
		if (eagle.anim == 4) {
			eagle.anim = 0;
		};
		snek.anim += 1;
		if (snek.anim == 15) {
			snek.anim = 0
		}
	};
};

function foodLoop() {
	if (gameOn()) {
		if (foodDistance() <= 150) {
			if (mouse.rotation == 0) {
				mouse.location[1] -= 20;
			} else if (mouse.rotation == 1) {
				mouse.location[0] += 20;
			} else if (mouse.rotation == 2) {
				mouse.location[1] += 20;
			} else if (mouse.rotation == 3) {
				mouse.location[0] -= 20;
			};
		};
		mouse.rotation = Math.floor(Math.random() * 4);
		if (mouse.location[0] <= 20 || mouse.location[0] >= 580 || mouse.location[1] <= 20 || mouse.location[1] >= 380) {
			resetFood()
		};
	};
};

function snekLoop() {
	if (gameOn()) {
		snek.calcDirection();
		if (eagle.isAlive() == false) {
			eagle.reset();
		} else {
			eagle.updateLocation();
		};
		//makes game faster over time
		if (snek.loopSpeed > 200) {
			snek.loopSpeed = 400 - (Math.floor((Date.now() - game.startTime) / 1000) * 2)
		} else {
			snek.loopSpeed = 200
		}
	};
	window.setTimeout(snekLoop, snek.loopSpeed);
};

function displayLoop() {
	if (gameOn()) {

		snek.checkFoodCollision(mouse,dirt);

		background();
		drawRocks()

		drawScore();
		drawHearts();
		drawPause();
		drawReset();

		snek.drawBody();
		snek.drawHead();
		drawFood();
		drawDirt();

		eagle.draw();
	};
	if (game.paused) {
		pausedWords();
	};
	if (game.over) {
		gameOver()
	};
	if (game.startPage) {
		startPage()
	};
};



//****************************************//

export function background() {
	ctx.drawImage(game.bImg, 0, 0);
}

export function drawHearts() {
	for (var i = 0; i < snek.life; i++) {
		ctx.drawImage(heart.image, 210 + 40 * i, 4);
	}
}

export function drawFood() {
	if (dirt.animating) {
		ctx.save();
		ctx.translate(mouse.location[0] + 10, mouse.location[1] + 10);
		ctx.rotate((mouse.rotation * Math.PI) / 2 + Math.PI);
		ctx.drawImage(mouse.image, -10, -10);
		ctx.restore();
	}
}

export function drawRocks() {
	for (var i = 0; i < rock.num; i++) {
		ctx.drawImage(rock.image, rock.arr[i][0], rock.arr[i][1]);
	}
}

export function drawPause() {
	ctx.drawImage(pause.image, pause.x, pause.y);
}

export function drawReset() {
	ctx.drawImage(resetImg.image, resetImg.x, resetImg.y);
}

export function pausedWords() {
	ctx.strokeStyle = "brown";
	ctx.fillText("PAUSED", 200, 200);
}

export function gameOver() {
	background();
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillText("GAME OVER", 175, 200);

	ctx.fillText("PLAY AGAIN", 175, 300);
}

export function startPage() {
	background();
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillText("PLAY SNEK", 175, 100);
	ctx.drawImage(play.image, play.x, play.y, 128, 128);
}

export function drawScore() {
	ctx.fillStyle = "black";
	ctx.font = "48px serif";
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgb(0,0,0)";
	ctx.fillText("Score : " + (snek.pArr.length - 3), 25, 430, 300);
	ctx.fillText("Highscore : " + Cookies.get("highscore"), 240, 430);
	ctx.strokeRect(20, 390, 200, 55);
	ctx.strokeRect(235, 390, 300, 55);

	ctx.fillText(
		secsToMins(Math.floor((Date.now() - game.startTime) / 1000)),
		20,
		35,
		160
	);
}

export function drawDirt() {
	if (dirt.animating) {
		let i = dirt.anim;
		while (i >= 5) {
			i -= 5;
		}
		ctx.drawImage(dirt.image, 0, i * 20, 20, 20, dirt.x, dirt.y, 20, 20);
		dirt.anim -= 1;
	}
}

export default <DefineComponent>{
	mounted() {
		c = this.$refs.canvas
		ctx = c.getContext('2d') ?? err();
		ctx.imageSmoothingEnabled = false;

		eagle = new Eagle(ctx)
		snek = new Snek(ctx);

		cw = c.width;
		ch = c.height - 60;

		c.addEventListener('click', function (event) {

			if (event.offsetX > pause.x && event.offsetX < pause.x + 32 && event.offsetY > pause.y && event.offsetY < pause.y + 32) {
				if (game.paused) {
					game.paused = false;
				} else {
					game.paused = true;
				};
			};
			if (game.startPage == true) {
				if (event.offsetX > play.x && event.offsetX < play.x + 128 && event.offsetY > play.y && event.offsetY < play.y + 128) {
					console.log('play button clicked')
					game.startPage = false;
					game.startTime = Date.now();
				};
			};
			if (event.offsetX > resetImg.x && event.offsetX < resetImg.x + 32 && event.offsetY > resetImg.y && event.offsetY < resetImg.y + 32) {
				reset()
			};
			if (game.over) {
				reset();
			};
		});

		eagle.reset();
		resetFood();
		resetRock();

		window.setInterval(displayLoop, 22);
		window.setInterval(foodLoop, 800);
		window.setInterval(eagleLoop, 150);

		window.setTimeout(snekLoop, snek.loopSpeed);

		document.addEventListener('keyup', logKey);

		document.addEventListener("keydown", function (e) {
			if (["Space", "ArrowUp", "ArrowDown"].includes(e.code)) {
				e.preventDefault();
			}
		});
	}
}