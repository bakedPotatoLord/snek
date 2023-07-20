
import eagleImg from '../assets/images/eagle.png'
import eagleShadow from '../assets/images/eagleShadow.png'
import { createImage } from './functions.js'

export default class Eagle {
	image= createImage(eagleImg)
	shadowImage= createImage(eagleShadow)
	x= 40
	y= 40
	anim= 0
	rotation= 1
	shadowIntensity= 10
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
};