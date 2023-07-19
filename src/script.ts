import Cookies from 'js-cookie'
import { DefineComponent } from 'vue';
import {createAudio, createImage} from './functions.js'

import bImg from './assets/images/background.png'
import dirtImg from './assets/images/dirt.png'
import eagleImg from './assets/images/eagle.png'
import eagleShadow from './assets/images/eagleShadow.png'
import heartImg from './assets/images/heart.png'
import mouseImg from './assets/images/mouse.png'
import pauseImg from './assets/images/pause.png'
import playImg from './assets/images/play.png'
import resetImgString from './assets/images/reset.png'
import rockImg from './assets/images/rock.png'
import snekImg from './assets/images/snek.png'

import eat from './assets/audio/eat.wav';
import pauseAudio from './assets/audio/pause.mp3';
import theme1 from './assets/audio/theme1.mp3';


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


const eagle = {
	'image': createImage(eagleImg),
	'shadowImage': createImage(eagleShadow),
	'x': 40,
	'y': 40,
	'anim': 0,
	'rotation': 1,
	'shadowIntensity': 10,
};

const snek = {
	'image': createImage(snekImg),
	'anim': 0,
	'height': 40,
	'displayDirection': 0,
	'loopSpeed': 400,
	'life': 3
};

const mouse = {
	'image': createImage(mouseImg),
	'rotation': 0,
	'anim': 0,
	'height': 20
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

const audio = {
	'eat': createAudio(eat),
	'pauseAudio': createAudio(pauseAudio),
	'theme1': createAudio(theme1),

}

const rock = {
	image: createImage(rockImg),
	arr: <any[]>[],
	num:0
}



let cw: number
let ch: number

let foodLocation = [20 + Math.floor(Math.random() * 28) * 20, 20 + Math.floor(Math.random() * 18) * 20]

mouse.rotation = Math.floor(Math.random() * 4);

let pArray = [[300, 200], [280, 200], [260, 200]];
let pDirection = 90;

let gameActive = true;

function reset() {

	snek.life = 3

	game.startTime = Date.now();

	gameActive = true;
	pArray = [[300, 200], [280, 200], [260, 200]];

	pDirection = 90;

	//reset mouse and eagle
	resetEagle()

	game.paused = false;
	game.startPage = false;
	game.over = false
};

function lifeReset() {

	pArray[0][0] = 300
	pArray[0][1] = 200
	for (var i = 1; i < pArray.length; i++) {
		pArray[i][0] = 280;
		pArray[i][1] = 200;
	};


	pDirection = 90;

	//reset mouse and eagle
	resetFood()
	resetEagle()
	resetRock();

	snek.life -= 1;
}

function resetFood() {
	foodLocation = [Math.floor(Math.random() * 28) * 20 + 20, Math.floor(Math.random() * 18) * 20 + 20]
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

function calcDirection() {

	for (var i = pArray.length - 1; i > 0; i -= 1) {
		pArray[i][0] = pArray[i - 1][0]
		pArray[i][1] = pArray[i - 1][1]

	};
	if (pDirection == 0) {
		pArray[0][1] -= 20;
	} else if (pDirection == 90) {
		pArray[0][0] += 20;
	} else if (pDirection == 180) {
		pArray[0][1] += 20;
	} else if (pDirection == 270) {
		pArray[0][0] -= 20;
	};

	snek.displayDirection = pDirection

}

function resetEagle() {
	eagle.rotation = Math.floor(Math.random() * 4)
	if (eagle.rotation == 0) {
		eagle.x = Math.floor(Math.random() * 28) * 20 + 20
		eagle.y = 420
	} else if (eagle.rotation == 1) {
		eagle.x = -40
		eagle.y = Math.floor(Math.random() * 18) * 20 + 20
	} else if (eagle.rotation == 2) {
		eagle.x = Math.floor(Math.random() * 28) * 20 + 20
		eagle.y = -40
	} else if (eagle.rotation == 3) {
		eagle.x = 620
		eagle.y = Math.floor(Math.random() * 18) * 20 + 20
	};
};

function updateEagleLocation() {
	if (eagle.rotation == 0) {
		eagle.y -= 20;
	} else if (eagle.rotation == 1) {
		eagle.x += 20;
	} else if (eagle.rotation == 2) {
		eagle.y += 20;
	} else if (eagle.rotation == 3) {
		eagle.x -= 20
	};
};

function eagleAlive() {
	if (eagle.x > -60 && eagle.x < 640 && eagle.y > -60 && eagle.y
		< 500) {
		return true;
	} else {
		return false;
	}
}

function foodDistance() {
	return Math.sqrt(Math.abs(pArray[0][0] - foodLocation[0]) ** 2 + Math.abs(pArray[0][1] - foodLocation[1]) ** 2)
}

function checkFoodCollision() {
	if (foodLocation[0] == pArray[0][0] && foodLocation[1] == pArray[0][1]) {

		audio.eat.play();

		pArray.push([pArray[pArray.length - 1][0], pArray[pArray.length - 1][1]])

		updateHS();

		foodLocation = [20 + Math.floor(Math.random() * 28) * 20, 20 + Math.floor(Math.random() * 18) * 20]
		dirt.animating = true;
		dirt.anim = 25;
		dirt.x = foodLocation[0];
		dirt.y = foodLocation[1];
	};
};

function checkRockCollision() {
	for (var i = 0; i < rock.arr.length; i++) {

		if (pArray[0][0] == rock.arr[i][0] && pArray[0][1] == rock.arr[i][1]) {
			return true;
			console.log('touched rock')
		};
	};
	return false;
};

function checkBodyCollision() {
	for (var i = 1; i < pArray.length; i++) {
		if (pArray[0][0] == pArray[i][0] && pArray[0][1] == pArray[i][1]) {
			return false;
		}
	}
	return true;
}

function isAlive() {
	return pArray[0][0] > 0 && pArray[0][0] < cw - 20 && pArray[0][1] > 20 && pArray[0][1] < ch - 20
};

function updateHS() {
	if (pArray.length - 3 > Cookies.get('highscore')) {
		Cookies.set('highscore', pArray.length - 3)
	}
}

function checkEagleCollision() {
	for (var i = 0; i < pArray.length; i++) {
		if (eagle.rotation == 0 || eagle.rotation == 2) {
			if ((pArray[i][0] == eagle.x && pArray[i][1] == eagle.y) || (pArray[i][0] == eagle.x && pArray[i][1] == eagle.y + 20) || (pArray[i][0] == eagle.x && pArray[i][1] == eagle.y - 20)) {
				return true;
			};
		} else {
			if ((pArray[i][0] == eagle.x && pArray[i][1] == eagle.y) || (pArray[i][0] == eagle.x + 20 && pArray[i][1] == eagle.y) || (pArray[i][0] == eagle.x - 20 && pArray[i][1] == eagle.y)) {
				return true;
			};
		};
	};
	return false;
};

function logKey(event: KeyboardEvent) {
	event.preventDefault()
	console.log(event.code)
	if ((event.key == 'w' || event.code == 'ArrowUp') && snek.displayDirection != 180) {
		pDirection = 0;
	} else if ((event.key == 'd' || event.code == 'ArrowRight') && snek.displayDirection != 270) {
		pDirection = 90;
	} else if ((event.key == 's' || event.code == 'ArrowDown') && snek.displayDirection != 0) {
		pDirection = 180;
	} else if ((event.key == 'a' || event.code == 'ArrowLeft') && snek.displayDirection != 90) {
		pDirection = 270;
	};
}

// must factor in game.paused == false && game.startPage == false
function gameOn() {
	if (gameActive) {
		if (game.paused || game.startPage) {
			return false;
		}
		if (isAlive() && checkBodyCollision() && checkEagleCollision() == false && checkRockCollision() == false) {
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
	} else {


	};
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
				foodLocation[1] -= 20;
			} else if (mouse.rotation == 1) {
				foodLocation[0] += 20;
			} else if (mouse.rotation == 2) {
				foodLocation[1] += 20;
			} else if (mouse.rotation == 3) {
				foodLocation[0] -= 20;
			};
		};

		mouse.rotation = Math.floor(Math.random() * 4);

		if (foodLocation[0] <= 20 || foodLocation[0] >= 580 || foodLocation[1] <= 20 || foodLocation[1] >= 380) {

			resetFood()

		};
	};
};

function snekLoop() {
	if (gameOn()) {

		calcDirection();

		if (eagleAlive() == false) {
			resetEagle();

		} else {
			updateEagleLocation();

		};

		//makes game faster over time
		snek.loopSpeed = 400 - (Math.floor((Date.now() - game.startTime) / 1000) * 2)
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

		checkFoodCollision();

		background();
		drawRocks()

		drawScore();
		drawHearts();
		drawPause();
		drawReset();

		body();
		head();
		drawFood();
		drawDirt();

		drawEagleShadow()
		drawEagle();



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

document.addEventListener('keyup', logKey);

document.addEventListener("keydown", function (e) {
	if (["Space","ArrowUp","ArrowDown"].includes(e.code)) {
		e.preventDefault();
	}
});

//****************************************//


export function background() {
	ctx.drawImage(game.bImg, 0, 0);
	/*
	ctx.fillStyle = 'rgb(212, 181, 150)';
	ctx.fillRect(0,0,600,460);
	ctx.fillStyle = 'rgb(94, 64, 22)';
	ctx.fillRect(0,0,600,40);
	ctx.fillRect(0,20,20,380);
	ctx.fillRect(0,380,600,400);
	ctx.fillRect(580,20,20,580);
*/
}

export function drawHearts() {
	for (var i = 0; i < snek.life; i++) {
		ctx.drawImage(heart.image, 210 + 40 * i, 4);
	}
}

export function drawFood() {
	if (dirt.animating) {
		ctx.save();
		ctx.translate(foodLocation[0] + 10, foodLocation[1] + 10);
		ctx.rotate((mouse.rotation * Math.PI) / 2 + Math.PI);
		ctx.drawImage(mouse.image, -10, -10);
		ctx.restore();
	}
}

export function head() {
	ctx.save();
	ctx.translate(pArray[0][0] + 10, pArray[0][1] + 10);
	ctx.rotate((pDirection * Math.PI) / 180);
	ctx.drawImage(snek.image, 0, snek.anim * 40, 40, 40, -20, -20, 40, 40);
	ctx.restore();
}

export function drawEagle() {
	ctx.save();
	ctx.translate(eagle.x + 10, eagle.y + 10);
	ctx.rotate(eagle.rotation * (Math.PI / 2));

	ctx.drawImage(eagle.image, 0, eagle.anim * 32, 32, 32, -32, -32, 64, 64);
	ctx.restore();
}

export function drawEagleShadow() {
	ctx.globalAlpha = 0.3;
	ctx.save();
	ctx.translate(
		eagle.x + 10 + eagle.shadowIntensity,
		eagle.y + 10 + eagle.shadowIntensity
	);
	ctx.rotate(eagle.rotation * (Math.PI / 2));

	ctx.drawImage(
		eagle.shadowImage,
		0,
		eagle.anim * 32,
		32,
		32,
		-32,
		-32,
		64,
		64
	);
	ctx.restore();
	ctx.globalAlpha = 1;
}

export function body() {
	ctx.strokeStyle = "rgb(40, 156, 36)";
	ctx.lineWidth = 10;

	for (var i = 0; i < pArray.length - 1; i++) {
		ctx.beginPath();
		ctx.moveTo(pArray[i][0] + 10, pArray[i][1] + 10);
		ctx.lineTo(pArray[i + 1][0] + 10, pArray[i + 1][1] + 10);
		ctx.stroke();
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
	ctx.fillText("Score : " + (pArray.length - 3), 25, 430, 300);
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

		resetEagle();
		resetFood();
		resetRock();

		window.setInterval(displayLoop, 22);
		window.setInterval(foodLoop, 800);
		window.setInterval(eagleLoop, 150);

		window.setTimeout(snekLoop, snek.loopSpeed);
	}
}