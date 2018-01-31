//bird physics state variables
var yPos = 250;
var yAcc = 0;
var gravity = -0.4;

//pipe state vairables
var curCenter = 250;
var pipeCenters = [250, 250, 250, 250];
var pipeSpeed = 5;
var pipeGap = 200;
var pipeDisp = 500+pipeGap;
var pipeWidth = 10;
var pipeHole = 90;

var isPaused = false;
var isNewGame = true;

var totalScore = 0;
function FlyBirdFly(element){

	var canvas = document.getElementById(element);
	canvas.height = 500;
	canvas.width = 700;
	var ctx = canvas.getContext('2d');

	animate(ctx);

}

window.addEventListener('keydown', keydownhandler ,false);

function keydownhandler(e) {
    if(e.keyCode == 32){
    	console.log("space bar pressed: ");
    	if(isNewGame){
    		resetgamestate();
    		isNewGame = false;
    	}else if(isPaused){
    		console.log("restarting");
    		resetgamestate();
    		isPaused = false;
		}
    	yAcc = 10;
    }
}

function animate(ctx){
	ctx.font = "30px Ariel";
	ctx.clearRect(0,0,700,500);
	ctx.fillRect(0, 0, 20, 500);
	ctx.fillRect(680, 0, 20, 500);

	if(isNewGame){
		gravity = 0;
		pipeDisp = 710;
		ctx.fillText("Press SpaceBar to start!",180,250);
	}

	if(isPaused){
		ctx.fillText("Game Over!", 250,210);
		ctx.fillText("Score is :"+totalScore,250,250);
		ctx.fillText("Press SpaceBar to start!", 180,290);
	}else{
		//draw updated bird
		yAcc = yAcc+gravity;
		yPos = yPos - (yAcc);
		ctx.beginPath();
		ctx.arc(100,yPos,10,0,2*Math.PI);
		ctx.fill();

		if(yPos <0 || yPos > 500){
			console.log("game over");
			yAcc = 0;
			gravity = 0;
			pause();
		}

		updatePipes();
		drawpipe(ctx);
		detectcollision();

		//print data values
		var data = getdata();

		var ele = document.getElementById("data");
		var str = "<b> yPos: </b>"+data[0].toFixed(2)+" <b> yAcc: </b>"+data[1].toFixed(2)+"</br>";
		str += "<b> pipeDisp: </b>"+data[2];
		str += "<b> pipeCenters: </b>"+data[3];
		ele.innerHTML = str;
	}
	requestAnimationFrame(function(){animate(ctx);});
}

function pause(){
	isPaused = true;
}

function updatePipes(){
	pipeDisp -= pipeSpeed;
	if(pipeDisp < 0){
		pipeDisp = pipeGap;
		generatepipe();
	}
}

function drawpipe(ctx){
	for (var i = 0; i < pipeCenters.length; i++) {
		ctx.beginPath()
		ctx.rect(i*pipeGap+pipeDisp, 0, pipeWidth, pipeCenters[i]-pipeHole);
		ctx.rect(i*pipeGap+pipeDisp, pipeCenters[i]+pipeHole, pipeWidth, 500);
		ctx.fill();
	}
	
}

function generatepipe(){
	var nextgap = pipeCenters[pipeCenters.length-1]+randomgap(-100,100);
	if(nextgap < 150 || nextgap > 400){
		nextgap = pipeCenters[pipeCenters.length-1];
	}
	if(pipeCenters.length < 4){
		pipeCenters.push(nextgap);
	}else{
		pipeCenters.shift();
		pipeCenters.push(nextgap);
	}
	totalScore += 1;
}

function randomgap(max, min){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function detectcollision(){
	if(90 < pipeDisp && pipeDisp < 110){
		if(yPos-10 < pipeCenters[0]-pipeHole || yPos+10 > pipeCenters[0]+pipeHole){
			console.log("game over");
			pause();
		}
	}
}

function getdata(){
	return [yPos, yAcc, pipeDisp, pipeCenters];
}

function resetgamestate(){
	yPos = 250;
	pipeDisp = 500+pipeGap;
	gravity = -0.4;
	yAcc = 0;
	pipeCenters = [250, 250, 250, 250];
}