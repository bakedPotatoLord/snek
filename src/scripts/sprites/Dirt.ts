import { createImage } from "../functions.js"
import dirtImg from '../assets/images/dirt.png'


export class Dirt {
  image = createImage(dirtImg)
  x = 0
  y = 0
  anim = 0
  animating = true
  ctx: CanvasRenderingContext2D
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }
  draw() {
    if (this.animating) {
      this.anim = (this.anim + 1) % 5;
      this.ctx.drawImage(this.image, 0, this.anim * 20, 20, 20, this.x, this.y, 20, 20);
    }
  }
}