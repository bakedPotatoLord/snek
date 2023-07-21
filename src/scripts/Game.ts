import bImg from '../assets/images/background.png'
import { createImage } from "./functions.js"

export default class Game{
  static startTime= Date.now()
	static paused= false
	static rect= []
	static over= false
	static startPage= true
	static bImg= createImage(bImg)
  static active = true;


  static on() {
    return Game.active && !(Game.paused || Game.startPage || Game.over)
  };
}