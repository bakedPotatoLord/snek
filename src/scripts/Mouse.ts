import mouseImg from '../assets/images/mouse.png'
import { createImage } from './functions.js'
import Game from './Game.js'

export default class Mouse {
  image = createImage(mouseImg)
  rotation = 0
  anim = 0
  height = 20
  location = [20 + Math.floor(Math.random() * 28) * 20, 20 + Math.floor(Math.random() * 18) * 20]
  ctx: CanvasRenderingContext2D
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    this.rotation = Math.floor(Math.random() * 4);
    window.setInterval(()=>this.movementLoop(), 800);
  }

  draw(dirt: any) {
    if (dirt.animating) {
      this.ctx.save();
      this.ctx.translate(this.location[0] + 10, this.location[1] + 10);
      this.ctx.rotate((this.rotation * Math.PI) / 2 + Math.PI);
      this.ctx.drawImage(this.image, -10, -10);
      this.ctx.restore();
    }
  }
  reset() {
    this.rotation = Math.floor(Math.random() * 4);
    this.location = [Math.floor(Math.random() * 28) * 20 + 20, Math.floor(Math.random() * 18) * 20 + 20]
  }
  
  movementLoop() {
    if (Game.on()) {
      this.rotation = Math.floor(Math.random() * 4);
        if (this.rotation == 0) {
          this.location[1] -= 20;
        } else if (this.rotation == 1) {
          this.location[0] += 20;
        } else if (this.rotation == 2) {
          this.location[1] += 20;
        } else if (this.rotation == 3) {
          this.location[0] -= 20;
        };
      if (this.location[0] <= 20 || this.location[0] >= 580 || this.location[1] <= 20 || this.location[1] >= 380) {
        this.reset()
      };
    };
  };
}