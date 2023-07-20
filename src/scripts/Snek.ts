import snekImg from '../assets/images/snek.png'
import Eagle from './Eagle.js'
import { createImage } from './functions.js'
import Cookies from 'js-cookie'
import { audio } from './script.js'

export default class Snek {
  image = createImage(snekImg)
  anim = 0
  height = 40
  displayDirection = 0
  loopSpeed = 400
  life = 3
  direction = 90;
  ctx: CanvasRenderingContext2D
  pArr = [[300, 200], [280, 200], [260, 200]]
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
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
    this.life -= 1
  }

  calcDirection() {
    for (var i = this.pArr.length - 1; i > 0; i -= 1) {
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
    this.displayDirection = this.direction
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

  checkRockCollision(rocks: any) {
    for (let rock of rocks.arr) {
      if (this.pArr[0][0] == rock[0] && this.pArr[0][1] == rock[1]) {
        return true;
      };
    };
    return false;
  };

  checkFoodCollision(mouse: any, dirt: any) {
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
}