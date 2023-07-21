
import eagleImg from '../assets/images/eagle.png'
import eagleShadow from '../assets/images/eagleShadow.png'
import { createImage } from './functions.js'
import Game from './Game.js'

export default class Eagle {
  image = createImage(eagleImg)
  shadowImage = createImage(eagleShadow)
  x = 40
  y = 40
  anim = 0
  rotation = 1
  shadowIntensity = 10
  ctx: CanvasRenderingContext2D
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    this.movementLoop()
    window.setInterval(() => this.animationLoop(), 150);
  }
  reset() {
    this.rotation = Math.floor(Math.random() * 4)
    if (this.rotation == 0) {
      this.x = Math.floor(Math.random() * 28) * 20 + 20
      this.y = 420
    } else if (this.rotation == 1) {
      this.x = -40
      this.y = Math.floor(Math.random() * 18) * 20 + 20
    } else if (this.rotation == 2) {
      this.x = Math.floor(Math.random() * 28) * 20 + 20
      this.y = -40
    } else if (this.rotation == 3) {
      this.x = 620
      this.y = Math.floor(Math.random() * 18) * 20 + 20
    };
  };
  updateLocation() {
    if (this.rotation == 0) {
      this.y -= 20;
    } else if (this.rotation == 1) {
      this.x += 20;
    } else if (this.rotation == 2) {
      this.y += 20;
    } else if (this.rotation == 3) {
      this.x -= 20
    };
  };

  isAlive() {
    return this.x > -60 && this.x < 640 && this.y > -60 && this.y < 500
  }

  draw() {
    this.drawShadow()
    this.ctx.save();
    this.ctx.translate(this.x + 10, this.y + 10);
    this.ctx.rotate(this.rotation * (Math.PI / 2));
    this.ctx.drawImage(this.image, 0, this.anim * 32, 32, 32, -32, -32, 64, 64);
    this.ctx.restore();
  }

  drawShadow() {
    this.ctx.save();
    this.ctx.globalAlpha = 0.3;
    this.ctx.translate(
      this.x + 10 + this.shadowIntensity,
      this.y + 10 + this.shadowIntensity
    );
    this.ctx.rotate(this.rotation * (Math.PI / 2));
    this.ctx.drawImage(
      this.shadowImage,
      0,
      this.anim * 32,
      32,
      32,
      -32,
      -32,
      64,
      64
    );
    this.ctx.globalAlpha = 1;
    this.ctx.restore();
  }
  movementLoop() {
    !this.isAlive() ?
      this.reset() :
      this.updateLocation();
    setTimeout(() => this.movementLoop(), 300)
  }

  animationLoop() {
    if (Game.on()) {
      this.anim = (this.anim + 1) % 4
    };
  };
};

