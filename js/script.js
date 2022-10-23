'use strict';
let countdownTimerMode = false;
let calculationDurationMode = true;

var playerName;
var difficulty = 'Легко';
var gameId;
var cardsCount = null;

document.querySelector('.timerMode').addEventListener('click', () => changeGameMode('Подсчет времени', document.querySelector('.timerMode')))
document.querySelector('.countdownMode').addEventListener('click', () => changeGameMode('Таймер', document.querySelector('.countdownMode')));

function changeGameMode(mode, sender) {
	if(sender.classList.contains('active')) return;
	document.querySelector('.timerMode').classList.toggle('active');
	document.querySelector('.countdownMode').classList.toggle('active');
	countdownTimerMode = mode === 'Таймер' ? true : false;
	calculationDurationMode = mode === 'Подсчет времени' ? true : false;
}

document.querySelector('.easyDifficulty').addEventListener('click', () => changeDifficulty('Легко', document.querySelector('.easyDifficulty')))
document.querySelector('.mediumDifficulty').addEventListener('click', () => changeDifficulty('Средне', document.querySelector('.mediumDifficulty')));
document.querySelector('.hardDifficulty').addEventListener('click', () => changeDifficulty('Сложно', document.querySelector('.hardDifficulty')));

function changeDifficulty(_difficulty, sender) {
	if(sender.classList.contains('active')) return;
	sender.classList.toggle('active');

	document.querySelector('.sizeInput').value = '';

	if(difficulty === 'Легко') document.querySelector('.easyDifficulty').classList.toggle('active');
	if(difficulty === 'Средне') document.querySelector('.mediumDifficulty').classList.toggle('active');
	if(difficulty === 'Сложно') document.querySelector('.hardDifficulty').classList.toggle('active');
	difficulty = _difficulty;
}

document.querySelector('.play').addEventListener('click',function(){
	if(document.querySelector('.sizeInput').value !== '' && document.querySelector('.sizeInput').value > 60){
		cardsCount = 60;
		difficulty = 'Пользовательская';
	} 
	if(document.querySelector('.sizeInput').value !== '' && document.querySelector('.sizeInput').value < 2){
		cardsCount = 2;
		difficulty = 'Пользовательская';
	} 
	if(document.querySelector('.sizeInput').value !== ''){
		cardsCount = Number(document.querySelector('.sizeInput').value);
		difficulty = 'Пользовательская';
	} 
	document.querySelector('.gameStart').classList.toggle('off');
	document.querySelector('.playGround').classList.toggle('off');
	if(cardsCount !== null) createGame([cardsCount, cardsCount]);
	if(difficulty === 'Легко') createGame([6, 6]);
	if(difficulty === 'Средне') createGame([10, 30]);
	if(difficulty === 'Сложно') createGame([10, 20]);
});

document.querySelector('.sizeInput').addEventListener('keydown', function() {
	if(document.querySelector('.sizeInput').value !== '') {
		document.querySelector('.easyDifficulty').classList.remove('active');
		document.querySelector('.mediumDifficulty').classList.remove('active');
		document.querySelector('.hardDifficulty').classList.remove('active');
		difficulty = 'Пользовательский'
	}
})

document.querySelector('.sizeInput').addEventListener('change', function() {
	if(Number(document.querySelector('.sizeInput').value) > 60) this.value = 60
	else if(Number(document.querySelector('.sizeInput').value) < 2) this.value = 2
})

function setData(data){
	setTimeout(() => {
		difficulty = data.difficulty;
		gameId = data.id;
		cardsCount = data.cardsCount;
		(data.calculationDurationMode) ? calculationDurationMode = true : calculationDurationMode = false;
		if(difficulty = 'Легко')
			createGame([cardsCount / 2,cardsCount / 2]);
		else if(difficulty = 'Легко')
			createGame([cardsCount / 3,cardsCount / 3]);
		else
			createGame([cardsCount / 4,cardsCount / 4]);
	},500);	
}
