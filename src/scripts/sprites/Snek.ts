import snekImg from '../../assets/images/snek.png'
import { createImage } from '../functions.js'
import Cookies from 'js-cookie'
import { audio, ch, cw } from '../script.js'
import Game from '../Game.js'
import type { Eagle, Dirt, Rocks, Mouse } from './index.js'

export class Snek {
  image = createImage(snekImg)
  anim = 0
  height = 40
  loopSpeed = 400
  life = 3
  direction = 90;
  ctx: CanvasRenderingContext2D
  pArr = [[300, 200], [280, 200], [260, 200]]
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    this.movementLoop()
    setInterval(() => this.animationLoop(), 150)
  }

  drawBody() {
    this.ctx.strokeStyle = "rgb(40, 156, 36)";
    this.ctx.lineWidth = 10;
    for (var i = 0; i < this.pArr.length - 1; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.pArr[i][0] + 10, this.pArr[i][1] + 10);
      this.ctx.lineTo(this.pArr[i + 1][0] + 10, this.pArr[i + 1][1] + 10);
      this.ctx.stroke();
    }
  }

  drawHead() {
    this.ctx.save();
    this.ctx.translate(this.pArr[0][0] + 10, this.pArr[0][1] + 10);
    this.ctx.rotate((this.direction * Math.PI) / 180);
    this.ctx.drawImage(this.image, 0, this.anim * 40, 40, 40, -20, -20, 40, 40);
    this.ctx.restore();
  }

  reset() {
    this.life = 3
    this.pArr = [[300, 200], [280, 200], [260, 200]];
    this.direction = 90;
  }

  lifereset() {
    this.direction = 90;
    this.pArr[0][0] = 300
    this.pArr[0][1] = 200
    for (var i = 1; i < this.pArr.length; i++) {
      this.pArr[i][0] = 280;
      this.pArr[i][1] = 200;
    };
  }

  calcDirection() {
    for (let i = this.pArr.length - 1; i > 0; i -= 1) {
      this.pArr[i][0] = this.pArr[i - 1][0]
      this.pArr[i][1] = this.pArr[i - 1][1]

    };
    if (this.direction == 0) {
      this.pArr[0][1] -= 20;
    } else if (this.direction == 90) {
      this.pArr[0][0] += 20;
    } else if (this.direction == 180) {
      this.pArr[0][1] += 20;
    } else if (this.direction == 270) {
      this.pArr[0][0] -= 20;
    };
  }

  checkEagleCollision(eagle: Eagle) {
    for (let seg of this.pArr) {
      if (seg[0] == eagle.x && seg[1] == eagle.y) {
        return true;
      }
    }
    return false;
  };

  checkBodyCollision() {
    for (let i = 1; i < this.pArr.length; i++) {
      if (this.pArr[0][0] == this.pArr[i][0] && this.pArr[0][1] == this.pArr[i][1]) {
        return false;
      }
    }
    return true;
  }
  checkRockCollision(rocks: Rocks) {
    for (let rock of rocks.arr) {
      if (this.pArr[0][0] == rock[0] && this.pArr[0][1] == rock[1]) {
        return true;
      };
    };
    return false;
  };
  checkFoodCollision(mouse: Mouse, dirt: Dirt) {
    if (mouse.location[0] == this.pArr[0][0] && mouse.location[1] == this.pArr[0][1]) {
      audio.eat.play();
      this.pArr.push([this.pArr[this.pArr.length - 1][0], this.pArr[this.pArr.length - 1][1]])
      this.updateHS();
      mouse.location = [20 + Math.floor(Math.random() * 28) * 20, 20 + Math.floor(Math.random() * 18) * 20]
      dirt.animating = true;
      dirt.anim = 25;
      dirt.x = mouse.location[0];
      dirt.y = mouse.location[1];
    };
  };

  updateHS() {
    if (this.pArr.length - 3 > Cookies.get('highscore')) {
      Cookies.set('highscore', this.pArr.length - 3)
    }
  }

  isAlive() {
    return this.pArr[0][0] > 0 &&
      this.pArr[0][0] < cw - 20 &&
      this.pArr[0][1] > 20 &&
      this.pArr[0][1] < ch - 20
  };

  movementLoop() {
    if (Game.on()) {
      this.calcDirection();
      //makes game faster over time
      if (this.loopSpeed > 200) {
        this.loopSpeed = 400 - (Math.floor((Date.now() - Game.startTime) / 1000) * 2)
      } else {
        this.loopSpeed = 200
      }
    };
    setTimeout(() => this.movementLoop(), this.loopSpeed);
  };

  animationLoop() {
    if (Game.on()) {
      this.anim = (this.anim + 1) % 15
    };
  };
}