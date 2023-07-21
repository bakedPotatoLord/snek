import { createImage } from "../functions.js";
import rockImg from '../assets/images/rock.png'

export class Rocks {
  image = createImage(rockImg)
  arr: [number,number][] = []
  ctx: CanvasRenderingContext2D
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }
  reset() {
    this.arr = Array(Math.floor(Math.random() * 10) + 5)
      .fill(null)
      .map(() => <[number,number]>[Math.floor(Math.random() * 28) * 20 + 20, Math.floor(Math.random() * 17) * 20 + 40])
      .filter(i => i[1] != 200)
  }
  draw() {
    this.arr.forEach((r) => {
      this.ctx.drawImage(this.image, ...r);
    })
  }
}