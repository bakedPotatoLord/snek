let c=document.getElementById('c');
var ctx = c.getContext('2d');

ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

eat.volume= 0.5

if(Cookies.get('highscore') == undefined){
Cookies.set('highscore' , "0");
};

game = {
	'startTime':Date.now(),
	'paused':false,
	'rect':[],
	'over':false,
	'startPage':true,
	'bImg':document.getElementById('bImg'),
}


eagle= {
	'image' :document.getElementById('eagle'),
  'shadowImage':document.getElementById('eagleShadow'),
	'x':40,
	'y':40,
	'anim':0,
	'rotation':1,
  'shadowIntensity':10,
};

snek= {
	'image' :document.getElementById('snek'),
	'anim':0,
	'height' :40,
	'displayDirection':0,
	'loopSpeed':400,
	'life':3
};

mouse= {
	'image' :document.getElementById('mouse'),
	'rotation':0,
	'anim':0,
	'height' :20
}

pause={
	'image':document.getElementById('pause'),
	'x':566,
	'y':4
}

resetImg={
	'image':document.getElementById('resetImg'),
	'x':530,
	'y':4
}

play={
	'image': document.getElementById('play'),
	'x':236,
	'y':150,
}

heart = {
	'image':document.getElementById('heart'),
}

dirt = {
	'image':document.getElementById('dirt'),
	'x':0,
	'y':0,
	'anim':0,
  'animating':true,
}

audio={
	'eat':document.getElementById('eat'),
	'pauseAudio':document.getElementById('pauseAudio'),
	'theme1':document.getElementById('theme1'),

}

rock={
  image:document.getElementById('rock'),
  arr:[],
}

mud={
	image: document.getElementById('mud'),
}

const cw = c.width;
const ch = c.height - 60;

foodLocation=[20 + Math.floor( Math.random() *28 ) * 20, 20 +Math.floor( Math.random() *18 ) * 20]

mouse.rotation = Math.floor( Math.random()* 4);

pArray = [[300,200],[280,200],[260,200]];
updateSnakeDirection = false;
pDirection = 90;

gameActive= true;

//audio.theme1.play()

function reset(){

	snek.life = 3

	game.startTime = Date.now();

	gameActive = true;
	pArray = [[300,200],[280,200],[260,200]];

	pDirection = 90;

	//reset mouse and eagle
	resetEagle()

	game.paused = false;
	game.startPage = false;
	game.over = false
};

function lifeReset(){

	pArray[0][0] = 300
	pArray[0][1] = 200
	for(var i = 1;i<pArray.length;i++){
		pArray[i][0] = 280;
		pArray[i][1] = 200;
	};


	pDirection = 90;

	//reset mouse and eagle
	resetFood()
	resetEagle()
  resetRock();

	snek.life -= 1;
}

function resetFood(){
  foodLocation=[ Math.floor( Math.random() *28 ) * 20 +20, Math.floor( Math.random() *18 ) * 20 +20]
}

function resetRock(){
  delete rock.arr;
  rock.arr=[]
  rock.num = Math.floor(Math.random()*10)+5;
  for(var i = 0;i<rock.num;i++){
    rock.arr.push( [Math.floor( Math.random() *28 ) * 20 +20, Math.floor( Math.random() *17 ) * 20 +40]  );
  };
  for(var i = 0;i<rock.num;i++){
    if(rock.arr[i][1] == 200){
      rock.arr[i][1] += 20
    }
  };
}

function secsToMins(sec){
	secs = sec;
	i = 0;
	while(secs>=60){
		secs -= 60;
		i+=1;
	};
	if(secs >9){
		return 'Survival time '+i+':'+ secs;
	}else{
		return 'Survival time '+i+':0'+ secs;
	}
}

function calcDirection(){

	for(var i=pArray.length-1; i>0 ;i-=1){
		pArray[i][0]=	pArray[i-1][0]
		pArray[i][1]=	pArray[i-1][1]
		
	};
	if(pDirection == 0){
		pArray[0][1] -= 20;
  }else if(pDirection == 90){
    pArray[0][0] += 20;
  }else if(pDirection == 180){
    pArray[0][1] += 20;
  }else if(pDirection == 270){
    pArray[0][0] -= 20;
  };

	snek.displayDirection = pDirection

}

function resetEagle(){
	eagle.rotation = Math.floor(Math.random() * 4)
	if(eagle.rotation == 0){
	eagle.x = Math.floor( Math.random() * 28 )*20 + 20
	eagle.y = 420
	}else if(eagle.rotation == 1){
		eagle.x = -40
		eagle.y = Math.floor( Math.random() * 18 )*20 +20
	}else if(eagle.rotation == 2){
		eagle.x = Math.floor( Math.random() * 28 )*20 + 20
		eagle.y = -40
	}else if(eagle.rotation == 3){
		eagle.x = 620
		eagle.y = Math.floor( Math.random() * 18 )*20 +20
	};
};

function updateEagleLocation(){
	if(eagle.rotation == 0){
	eagle.y -= 20;
	}else if(eagle.rotation == 1){
		eagle.x += 20;
	}else if(eagle.rotation == 2){
		eagle.y += 20;
	}else if(eagle.rotation == 3){
		eagle.x -=20
	};
};

function eagleAlive(){
	if( eagle.x > -60 & eagle.x < 640 & eagle.y > -60 & eagle.y 
	< 500){
		return true;
	} else{
		return false;
	}
}

function foodDistance(){
	return Math.sqrt( Math.abs(pArray[0][0] - foodLocation[0])**2 + Math.abs(pArray[0][1] - foodLocation[1])**2  )
}

function checkFoodCollision(){
	if( foodLocation[0]  == pArray[0][0] && foodLocation[1] == pArray[0][1]){

    eat.play();
    
		pArray.push([pArray[pArray.length-1][0],pArray[pArray.length-1][1]])

		updateHS();

		foodLocation=[20 + Math.floor( Math.random() *28 ) * 20, 20 +Math.floor( Math.random() *18 ) * 20]
    dirt.animating=true;
    dirt.anim=25;
    dirt.x=foodLocation[0];
    dirt.y=foodLocation[1];
	};
};

function checkRockCollision(){
  for(var i = 0;i<rock.arr.length;i++){

    if(pArray[0][0] == rock.arr[i][0] && pArray[0][1] == rock.arr[i][1]){
      return true;
      console.log('touched rock')
    };
  };
	return false;
};

function checkBodyCollision(){
	for(var i = 1;i<pArray.length;i++){
		if(pArray[0][0] == pArray[i][0] & pArray[0][1] == pArray[i][1]){
			return false;
		}
	}
	return true;
}

function isAlive(){
	if(pArray[0][0] > 0 & pArray[0][0] < cw - 20 & pArray[0][1] > 20 & pArray[0][1] < ch - 20){
		return true;
	}else{
		return false;
	};
};

function updateHS(){
	if(pArray.length - 3 > Cookies.get('highscore') ){
		Cookies.set('highscore', pArray.length - 3 )
	}
}


function checkEagleCollision(){
	for(var i = 0 ; i< pArray.length;i++){
		if(eagle.rotation == 0 || eagle.rotation == 2){
			if( ( pArray[i][0] == eagle.x & pArray[i][1] == eagle.y ) || ( pArray[i][0] == eagle.x & pArray[i][1] == eagle.y + 20 ) || ( pArray[i][0] == eagle.x & pArray[i][1] == eagle.y - 20) ){
				return true;
			};
		}else{
			if( ( pArray[i][0] == eagle.x & pArray[i][1] == eagle.y ) || ( pArray[i][0] == eagle.x + 20 & pArray[i][1] == eagle.y ) || ( pArray[i][0] == eagle.x - 20 & pArray[i][1] == eagle.y) ){
				return true;
			};
		};
	};
	return false;
};

function logKey(event){
	updateSnakeDirection = true;


	if( (event.key == 'w' || event.code == 'ArrowUp' ) & snek.displayDirection != 180 ){
		pDirection=0;
  }else if( (event.key == 'd' || event.key == 'ArrowLeft' ) & snek.displayDirection != 270){
    pDirection=90;
  }else if( (event.key == 's' || event.key == 'ArrowDown' ) & snek.displayDirection != 0){
    pDirection=180;
  }else if( (event.key == 'a' || event.key == 'ArrowRight' ) & snek.displayDirection != 90){
    pDirection=270;
  };
}



window.onload =function(){
	resetEagle();
  resetFood();
  resetRock();

	window.setInterval(displayLoop,22);
  window.setInterval(foodLoop,800);
	window.setInterval(eagleLoop,150);

	window.setTimeout(snekLoop,snek.loopSpeed);
};

// must factor in game.paused == false & game.startPage == false
function gameOn(){
	if(gameActive ){
		if( game.paused || game.startPage ){
			return false;
		}
		if(isAlive() & checkBodyCollision() & checkEagleCollision() == false & checkRockCollision() == false){
			return true;
		}else{
			if(snek.life > 1){
				lifeReset();
				console.log('lives  '+ snek.life)
				return true;
			}else{
				game.over = true;
			}
		};
	}else{
		

	};
};

function eagleLoop(){
	if(gameOn() ){

		eagle.anim = eagle.anim + 1
		if(eagle.anim == 4){
			eagle.anim = 0;
		};
		
		snek.anim += 1;
		if(snek.anim == 15){
			snek.anim = 0
		}
		
	};
};

function foodLoop(){
	if( gameOn() ){
		if(foodDistance() <= 150){
			if(mouse.rotation == 0){
				foodLocation[1] -= 20;
			}else if(mouse.rotation == 1){
				foodLocation[0] += 20;
			}else if(mouse.rotation == 2){
				foodLocation[1] += 20;
			}else if(mouse.rotation == 3){
				foodLocation[0] -= 20;
			};
		};

		mouse.rotation = Math.floor( Math.random()* 4);
		
		if(foodLocation[0]<=20 || foodLocation[0]>=580 || foodLocation[1]<=20 || foodLocation[1]>=380){

			resetFood()

		};
	};
};

function snekLoop(){
	if(gameOn() ){

		calcDirection();

		if( eagleAlive() == false ){
			resetEagle();

		}else{
			updateEagleLocation();
			
		};

	//makes game faster over time
	snek.loopSpeed = 400 - ( Math.floor( (Date.now() - game.startTime) /1000 ) * 2)
	if(snek.loopSpeed > 200){
		snek.loopSpeed = 400 - ( Math.floor( (Date.now() - game.startTime) /1000 ) * 2)
	}else{
		snek.loopSpeed = 200
	}
	};
	window.setTimeout(snekLoop,snek.loopSpeed);
};

function displayLoop(){
	if(gameOn() ){

		checkFoodCollision();

		background();
    drawRocks()

		drawScore();
		drawHearts();
		drawPause();
		drawReset();

		body();
		head();
		drawFood();
    drawDirt();
    
    drawEagleShadow()
		drawEagle();
    


	};
	if(game.paused){
		pausedWords();
	};
	if(game.over){
		gameOver()
	};
	if(game.startPage){
		startPage()
	};
};

document.addEventListener('keypress', logKey);

document.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

c.addEventListener('click',function(event){

	if(event.offsetX > pause.x & event.offsetX < pause.x + 32 & event.offsetY > pause.y & event.offsetY < pause.y + 32){
		if(game.paused){
			game.paused = false;
		}else{
			game.paused=true;
		};
	};

	if(game.startPage == true){
		if(event.offsetX > play.x & event.offsetX < play.x + 128 & event.offsetY > play.y & event.offsetY < play.y + 128){
			console.log('play button clicked')
			game.startPage= false;
			game.startTime = Date.now();
		};
	};

	if(event.offsetX > resetImg.x & event.offsetX < resetImg.x + 32 & event.offsetY > resetImg.y & event.offsetY < resetImg.y + 32){
		reset()
	};

  if(game.over){
    reset();
  };
	
});

