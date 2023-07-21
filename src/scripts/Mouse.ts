import mouseImg from '../assets/images/mouse.png'
import { createImage } from './functions.js'

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
}