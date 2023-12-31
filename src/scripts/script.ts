import Cookies from 'js-cookie'
import { DefineComponent } from 'vue';
import { createAudio } from './functions.js'

//audio
import eat from '../assets/audio/eat.wav';
import pauseAudio from '../assets/audio/pause.mp3';
import theme1 from '../assets/audio/theme1.mp3';
//global state manager
import Game from './Game.js';
//game objects
import {Dirt, Rocks, Snek, Eagle, Mouse} from './sprites/index.js'
import { background, drawHearts, drawPause, drawReset, drawScore, gameOver, pause, pausedWords, play, resetImg, startPage } from './background.js';

let eagle: Eagle
let snek: Snek
let mouse: Mouse
let rocks: Rocks
let dirt: Dirt

let c: HTMLCanvasElement
let ctx: CanvasRenderingContext2D

const err =()=>{throw new Error("error")}

if (Cookies.get('highscore') == undefined) Cookies.set('highscore', "0")

export const audio = {
	eat: createAudio(eat),
	pauseAudio: createAudio(pauseAudio),
	theme1: createAudio(theme1),
}

export const cw = 600
export const ch = 400

function reset() {
	Game.startTime = Date.now();
	Game.active = true;
	snek.reset()
	eagle.reset()
	mouse.reset()
	Game.paused = false;
	Game.startPage = false;
	Game.over = false
};
function lifeReset() {
	//reset mouse and eagle
	mouse.reset()
	eagle.reset()
	snek.lifereset()
	rocks.reset();
	snek.life -= 1;
}
function logKey(event: KeyboardEvent) {
	event.preventDefault()
	console.log(event.code)
	if ((event.key == 'w' || event.code == 'ArrowUp') && snek.direction != 180) {
		snek.direction = 0;
	} else if ((event.key == 'd' || event.code == 'ArrowRight') && snek.direction != 270) {
		snek.direction = 90;
	} else if ((event.key == 's' || event.code == 'ArrowDown') && snek.direction != 0) {
		snek.direction = 180;
	} else if ((event.key == 'a' || event.code == 'ArrowLeft') && snek.direction != 90) {
		snek.direction = 270;
	};
	snek.drawHead()
}
function checkColissionLoop() {
	if (snek.isAlive() &&
		snek.checkBodyCollision() &&
		!snek.checkEagleCollision(eagle) &&
		!snek.checkRockCollision(rocks)) {
	} else {
		if (snek.life > 1) {
			lifeReset();
			console.log('lives', snek.life)
		} else {
			Game.over = true;
		}
	};
	requestAnimationFrame(checkColissionLoop);
}

function displayLoop() {
	if (Game.on()) {
		snek.checkFoodCollision(mouse, dirt);
		background(ctx);
		rocks.draw()
		drawScore(ctx, snek);
		drawHearts(ctx, snek);
		drawPause(ctx);
		drawReset(ctx);
		snek.drawBody();
		snek.drawHead();
		mouse.draw(dirt);
		dirt.draw();
		eagle.draw();
	};
	if (Game.paused) pausedWords(ctx);
	if (Game.over) gameOver(ctx)
	if (Game.startPage) startPage(ctx)
};

export default <DefineComponent>{
	mounted() {
		c = this.$refs.canvas
		ctx = c.getContext('2d') ?? err();
		ctx.imageSmoothingEnabled = false;

		eagle = new Eagle(ctx)
		snek = new Snek(ctx);
		mouse = new Mouse(ctx);
		rocks = new Rocks(ctx);
		dirt = new Dirt(ctx);

		c.width = cw;
		c.height = ch + 60;

		c.addEventListener('click', event => {
			if (event.offsetX > pause.x &&
				event.offsetX < pause.x + 32 &&
				event.offsetY > pause.y &&
				event.offsetY < pause.y + 32) Game.paused = !Game.paused
			if (Game.startPage &&
				event.offsetX > play.x &&
				event.offsetX < play.x + 128 &&
				event.offsetY > play.y &&
				event.offsetY < play.y + 128) Game.start()
			if (event.offsetX > resetImg.x &&
				event.offsetX < resetImg.x + 32 &&
				event.offsetY > resetImg.y &&
				event.offsetY < resetImg.y + 32) reset()
			if (Game.over) reset();
		});

		eagle.reset();
		mouse.reset();
		rocks.reset();

		window.setInterval(displayLoop, 22);
		checkColissionLoop();
		document.addEventListener('keyup', logKey);
		document.addEventListener("keydown", function (e) {
			if (["Space", "ArrowUp", "ArrowDown"].includes(e.code)) {
				e.preventDefault();
			}
		});
	}
}