'use strict';
let countdownTimerMode = false;
let calculationDurationMode = false;
let serverGame = false; 
let isJoined = false;

var playerName;
var difficulty;
var gameId;

document.querySelector('.inputPlayerName').addEventListener('input', function(){
	document.querySelector('.classicGameButton').disabled = document.querySelector('.inputPlayerName').value === '';
	document.querySelector('.onlineGameButton').disabled = document.querySelector('.inputPlayerName').value === '';
});
document.querySelector('.classicGameButton').addEventListener('click',function(){
	document.querySelector('.gameInfoWrap').classList.toggle('off');
	document.querySelector('.chooseModeWrap').classList.toggle('off');
	playerName = document.querySelector('.inputPlayerName').value;
});
document.querySelector('.onlineGameButton').addEventListener('click',function(){
	document.querySelector('.gameInfoWrap').classList.toggle('off');
	document.querySelector('.serverModeWrap').classList.toggle('off');
	playerName = document.querySelector('.inputPlayerName').value;
	serverGame = true;
});
document.getElementById('createServerGame').addEventListener('click',function(){
	document.querySelector('.serverModeWrap').classList.toggle('off');
	document.querySelector('.chooseModeWrap').classList.toggle('off');
});
document.getElementById('joinServerGame').addEventListener('click',function(){
	document.querySelector('.serverModeWrap').classList.toggle('off');
	document.querySelector('.joinServerGameWrap').classList.toggle('off');
});
document.getElementById('inputId').addEventListener('input', function(){
	document.getElementById('joinGame').disabled = document.getElementById('inputId').value === '';
});
document.getElementById('joinGame').addEventListener('click',function(){
	isJoined = true;
	document.querySelector('.joinServerGameWrap').classList.toggle('off');
		fetch('ajax.php?id='+Number(inputId.value)+'&do=checkId')
		.then(data => data.json())
		.then(json => setData(JSON.parse(json)))
});

document.getElementById('timerMode').addEventListener('click',function(){
	document.querySelector('.chooseModeWrap').classList.toggle('off');
	document.querySelector('.chooseTypeWrap').classList.toggle('off');
	calculationDurationMode = true;
});
document.getElementById('countdownMode').addEventListener('click',function(){
	document.querySelector('.chooseModeWrap').classList.toggle('off');
	document.querySelector('.chooseTypeWrap').classList.toggle('off');
	countdownTimerMode = true;
});

document.getElementById('sizeType').addEventListener('click',function(){
	document.querySelector('.chooseTypeWrap').classList.toggle('off');
});
document.getElementById('difficultyType').addEventListener('click',function(){
	document.querySelector('.chooseTypeWrap').classList.toggle('off');
	document.querySelector('.chooseDifficultyWrap').classList.toggle('off');
});

document.getElementById('easyDifficulty').addEventListener('click',function(){
	document.querySelector('.chooseDifficultyWrap').classList.toggle('off');
	difficulty = 'Легко';
	generateWithDifficulty();
});
document.getElementById('mediumDifficulty').addEventListener('click',function(){
	document.querySelector('.chooseDifficultyWrap').classList.toggle('off');
	difficulty = 'Средне';
	generateWithDifficulty();
});
document.getElementById('hardDifficulty').addEventListener('click',function(){
	document.querySelector('.chooseDifficultyWrap').classList.toggle('off');
	difficulty = 'Сложно';
	generateWithDifficulty();
});

function setData(data){
	setTimeout(() => {
			difficulty = data.difficulty;
			gameId = data.id;
			if(data.difficulty == 'Легко'){
				makeArray([6,6],2);
			}
			else if(data.difficulty == 'Средне'){
				makeArray([Number(data.cardsCount) / 3,Number(data.cardsCount) / 3],3);
			}
			else{
				makeArray([Number(data.cardsCount) / 4,Number(data.cardsCount) / 4],4);
			}
	},500);	
}
