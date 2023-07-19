

function background(){

ctx.drawImage(game.bImg,0,0)
/*
	ctx.fillStyle = 'rgb(212, 181, 150)';
  ctx.fillRect(0,0,600,460);
	ctx.fillStyle = 'rgb(94, 64, 22)';
	ctx.fillRect(0,0,600,40);
	ctx.fillRect(0,20,20,380);
	ctx.fillRect(0,380,600,400);
	ctx.fillRect(580,20,20,580);
*/
};

function drawHearts(){
	for(var i = 0;i< snek.life;i++){
		ctx.drawImage(heart.image,210+(40*i),4)
	}
}

function drawFood(){
  if(dirt.animating){
    ctx.save();
    ctx.translate(foodLocation[0]+10,foodLocation[1]+10);
    ctx.rotate ( (mouse.rotation * Math.PI / 2) + Math.PI );
    ctx.drawImage(mouse.image,-10,-10);
    ctx.restore();
  };
};

function head(){
	ctx.save();
	ctx.translate(pArray[0][0]+10, pArray[0][1]+10);
	ctx.rotate( ( ( pDirection * Math.PI ) /180 ) );
	ctx.drawImage(snek.image,0,snek.anim *40 ,40,40, -20,-20,40,40)
	ctx.restore();
};

function drawEagle(){
	ctx.save();
	ctx.translate(eagle.x+10,eagle.y+10);
	ctx.rotate(eagle.rotation * (Math.PI / 2) )

	ctx.drawImage(eagle.image, 0, eagle.anim * 32, 32, 32, -32, -32, 64, 64);
	ctx.restore();
};

function drawEagleShadow(){
  ctx.globalAlpha = 0.3;
	ctx.save();
	ctx.translate(eagle.x+10+eagle.shadowIntensity,eagle.y+10+ eagle.shadowIntensity);
	ctx.rotate(eagle.rotation * (Math.PI / 2) )

	ctx.drawImage(eagle.shadowImage, 0, eagle.anim * 32, 32, 32, -32, -32, 64, 64);
	ctx.restore();
  ctx.globalAlpha = 1;
};

function body(){
	ctx.strokeStyle='rgb(40, 156, 36)'
	ctx.lineWidth = 10;
	
	for(var i=0;i<pArray.length - 1 ;i++){
		
		ctx.beginPath();
		ctx.moveTo(pArray[i][0]+10,pArray[i][1]+10);
		ctx.lineTo(pArray[i+1][0]+10,pArray[i+1][1]+10);
		ctx.stroke();
	};
};

function drawRocks(){
  for(var i=0;i<rock.num;i++){
    ctx.drawImage(rock.image,rock.arr[i][0],rock.arr[i][1]);
  };
};

function drawPause(){
		ctx.drawImage(pause.image,pause.x,pause.y);
};

function drawReset(){
		ctx.drawImage(resetImg.image,resetImg.x,resetImg.y);
};


function pausedWords(){
	ctx.strokeStyle = 'brown'
	ctx.fillText('PAUSED',200,200)
};

function gameOver(){
  background();
	ctx.fillStyle = 'rgb(0,0,0)';
	ctx.fillText('GAME OVER',175,200);

	ctx.fillText('PLAY AGAIN',175,300);

};

function startPage(){
	background();
	ctx.fillStyle = 'rgb(0,0,0)';
	ctx.fillText('PLAY SNEK',175,100);
	ctx.drawImage(play.image,play.x,play.y,128,128)

};

function drawScore(){
	ctx.fillStyle = 'black'
	ctx.font = '48px serif';
	ctx.lineWidth = 2;
	ctx.strokeStyle = 'rgb(0,0,0)'
  ctx.fillText('Score : ' + (pArray.length - 3 ), 25, 430,300);
	ctx.fillText('Highscore : ' + Cookies.get('highscore'),240,430);
	ctx.strokeRect(20,390,200,55);
	ctx.strokeRect(235,390,300,55);

	ctx.fillText( secsToMins( Math.floor( ( Date.now() - game.startTime) / 1000 ) ), 20,35,160);
}

function drawDirt(){
  if(dirt.animating){
    i=dirt.anim;
    while(i >= 5){
      i -= 5;
    };
    ctx.drawImage(dirt.image,0,(i *20), 20,20,dirt.x,dirt.y,20,20);
    dirt.anim -= 1;
  };
};

