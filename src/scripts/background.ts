import Game from './Game.js'
import Cookies from 'js-cookie'

import resetImgString from '../assets/images/reset.png'
import { createImage } from './functions.js';
import heartImg from '../assets/images/heart.png'
import pauseImg from '../assets/images/pause.png'
import playImg from '../assets/images/play.png'
import type {Snek} from './sprites/Snek.js';

export const resetImg = {
	image: createImage(resetImgString),
	x: 530,
	y: 4
}

const heart = {
	image: createImage(heartImg)
}

export const pause = {
	image: createImage(pauseImg),
	x: 566,
	y: 4
}

export const play = {
	image: createImage(playImg),
	x: 236,
	y: 150,
}

export function background(ctx: CanvasRenderingContext2D) {
	ctx.drawImage(Game.bImg, 0, 0);
}

export function drawHearts(ctx: CanvasRenderingContext2D,snek:Snek) {
	for (var i = 0; i < snek.life; i++) {
		ctx.drawImage(heart.image, 210 + 40 * i, 4);
	}
}

export function drawPause(ctx: CanvasRenderingContext2D) {
	ctx.drawImage(pause.image, pause.x, pause.y);
}

export function drawReset(ctx: CanvasRenderingContext2D) {
	ctx.drawImage(resetImg.image, resetImg.x, resetImg.y);
}

export function pausedWords(ctx: CanvasRenderingContext2D) {
	ctx.strokeStyle = "brown";
	ctx.fillText("PAUSED", 200, 200);
}

export function gameOver(ctx: CanvasRenderingContext2D) {
	background(ctx);
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillText("GAME OVER", 175, 200);

	ctx.fillText("PLAY AGAIN", 175, 300);
}

export function startPage(ctx: CanvasRenderingContext2D) {
	background(ctx);
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillText("PLAY SNEK", 175, 100);
	ctx.drawImage(play.image, play.x, play.y, 128, 128);
}

export function drawScore(ctx: CanvasRenderingContext2D,snek:Snek) {
	ctx.fillStyle = "black";
	ctx.font = "48px serif";
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgb(0,0,0)";
	ctx.fillText("Score : " + (snek.pArr.length - 3), 25, 430, 300);
	ctx.fillText("Highscore : " + Cookies.get("highscore"), 240, 430);
	ctx.strokeRect(20, 390, 200, 55);
	ctx.strokeRect(235, 390, 300, 55);

	ctx.fillText(
		secsToMins(Math.floor((Date.now() - Game.startTime) / 1000)),
		20,
		35,
		160
	);
}

function secsToMins(sec: number) {
  return 'Survival time ' + Math.floor(sec / 60) + ':' + sec%60;
}