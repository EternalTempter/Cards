'use strict';
var cardCords = [];

let removedCards = [];

let timerId;
let time = 0;
let currentTime;

let score;
let scoreMultiplier;
let movesCount = 0;

let timeout;
let winInterval;

let calculateDurationInterval;
let checkOpponentsMove;

let serverData = {difficulty: 'пусто'};

let playField = document.querySelector('.playField');

function createGame(cardRange){
	let images = [];
	let randomArray = [];
	let multipliedArray = [];
	images = fillArrayWithImageSources(images);
	multipliedArray = getSettingsByDifficulty(randomArray,cardRange,multipliedArray,images);
	let shuffledArray = shuffle(multipliedArray);
	buildField(shuffledArray);
	(calculationDurationMode) ? startTimer(time,1) : startTimer(time,-1);
	setClickEvents();
	setStartScore();
}
function fillArrayWithImageSources(array){
	for(let i = 1;i <= 30; i++){
		array.push(String(i) + '.png');
	}
	return array;
}
function getSettingsByDifficulty(randomArray,cardRange,multipliedArray,images){
	if(difficulty == 'Легко'){
		document.querySelector('.label').innerHTML = 'Режим сложности: Легкий'
		randomArray = randomizeArray([cardRange[0],cardRange[1]],images,randomArray);
		multipliedArray = multiplyArray(randomArray,2);
		time = (calculationDurationMode) ? 0 : 70;
	}
	else if(difficulty == 'Средне'){
		document.querySelector('.label').innerHTML = 'Режим сложности: Средний'
		randomArray = randomizeArray([cardRange[0],cardRange[1]],images,randomArray);	
		multipliedArray = multiplyArray(randomArray,3);
		time = (calculationDurationMode) ? 0 : 250;
	}
	else if(difficulty == 'Сложно'){
		document.querySelector('.label').innerHTML = 'Режим сложности: Сложный'
		randomArray = randomizeArray([cardRange[0],cardRange[1]],images,randomArray);
		multipliedArray = multiplyArray(randomArray,4);
		time = (calculationDurationMode) ? 0 : 400;
	}
	else{
		document.querySelector('.label').innerHTML = 'Режим сложности: Пользовательский'
		randomArray = randomizeArray([cardRange[0] / 2,cardRange[1] / 2],images,randomArray);
		multipliedArray = multiplyArray(randomArray,2);
		difficulty = 'Пользовательская';
		time = (calculationDurationMode) ? 0 : 150;
	}
	return multipliedArray;
}
function randomizeArray(range,images,randomArray){
	for(let i = 1;i <= getRandomNumber(range[0],range[1]); i++){
		randomArray.push(checkForUnique(getRandomNumber(0,29),images,randomArray));
	}
	return randomArray;
}
function checkForUnique(number,images,randomArray){	
	return (randomArray.includes(images[number])) ? checkForUnique(getRandomNumber(0,29),images,randomArray) : (number + 1) + '.png';
}
function multiplyArray(array,cloneTimes){
	let multipliedArray = array;
	for(let i = 0;i < cloneTimes - 1;i++){
		multipliedArray = multipliedArray.concat(array);
	}
	return multipliedArray
}
function shuffle(array) {
	  for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1)); 
		[array[i], array[j]] = [array[j], array[i]];
	  }
	return array;
}
function buildField(array){
	let cardSize; 
	if(array.length > 30 && array.length <= 50) {
		cardSize = 'medium';
	} 
	else if(array.length > 50){
		cardSize = 'tiny';
	} 
	else {
		cardSize = 'large';
	}
	for(let i = 0;i < array.length;i++){
		playField.innerHTML += `<div class="flip-card ${cardSize}">
									<div class="flip-card-inner closed">
										<div class="flip-card-front">
											<img src="img/cardBack.png">
										</div>
										<div class="flip-card-back">
											<img src="img/${array[i]}">
										</div>
									</div>
								</div>`;
	}
}
function setStartScore(){
	scoreMultiplier = 10;
	score = Math.round((playField.childElementCount * scoreMultiplier) / 1.5);
	document.querySelector('.scoreCount').innerHTML = `Очки: ${score}`;
}
function getRandomNumber(min,max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function setClickEvents(){
	playField = document.querySelector('.playField');
	for(let i = 0; i < playField.childElementCount;i++){
		playField.children[i].addEventListener('click',function(){
				playField.children[i].children[0].classList.toggle('opened');
				playField.children[i].children[0].classList.toggle('closed');
				if(difficulty == 'Легко' || difficulty == 'Пользовательская')
					compareCards(playField.children[i],2);
				if(difficulty == 'Средне')
					compareCards(playField.children[i],3);
				if(difficulty == 'Сложно')
					compareCards(playField.children[i],4);

		});
	}
}
function compareCards(card,times){
	let openedCards = [];
	playField.childNodes.forEach(card => card.classList.remove('pointerEventOff'));
	for(let i = 0;i < playField.childElementCount;i++){
		if(playField.children[i].children[0].classList.contains('opened')){
			playField.children[i].classList.toggle('pointerEventOff');
			openedCards.push(playField.children[i].children[0].children[1].children[0]);
		}
	}
	if(openedCards.length == times){
		movesCount++;
		playField.style.pointerEvents = 'none';
		for(let i = 0;i < openedCards.length; i++){
			if(openedCards[0].src == openedCards[i].src){}
			else{
				score -= scoreMultiplier;
				if(score > 0)
					document.querySelector('.scoreCount').innerHTML = `Количество очков: ${score}`;
				else{
					notifyLose();
				}
				closeCards(openedCards);
				return;
			}
		}
		if(times === 2) score += times * scoreMultiplier;
		if(times === 3) score += times * (scoreMultiplier * 2);
		if(times === 4) score += times * (scoreMultiplier * 3);
		document.querySelector('.scoreCount').innerHTML = `Количество очков: ${score}`;
		setTimeout(() => playField.childNodes.forEach(card => card.children[0].classList.remove('opened')),500);
		hideCards(openedCards);
		setTimeout(() => playField.style.pointerEvents = 'auto',500);
		setTimeout(checkForWin,500);
		return;
	}
}

function closeCards(array){
	setTimeout(function(){
		array.forEach(card => {
			card.parentElement.parentElement.parentElement.classList.toggle('pointerEventOff');
			card.parentElement.parentElement.classList.toggle('opened');
			card.parentElement.parentElement.classList.toggle('closed');
		});
		playField.style.pointerEvents = 'auto';
		clearInterval(this);
	},500);
}
function hideCards(array){
	setTimeout(() => {
		array.forEach(card => {
			card.parentElement.parentElement.parentElement.classList.toggle('hide');
		});
	}, 500)
}
function checkForWin(){
	for(let i = 0; i < playField.childElementCount;i++){
		if(!playField.childNodes[i].classList.contains('hide')){
			return;	
		}
	}
	notifyWin();
}
function notifyWin(){
	clearInterval(timerId);
	clearInterval(checkOpponentsMove);
	playField.classList.toggle('off');
	let resultTime = (calculationDurationMode) ? currentTime - time : time - currentTime;
	document.querySelector('.playGround').classList.toggle('off');
	document.querySelector('.afterGameWrap').classList.toggle('off');
	document.querySelector('.afterGameInfo').classList.toggle('off');
	document.querySelector('.afterGameInfo').innerHTML = 
			`<h1>Поздравляю, вы выиграли!<h1>
			<p>Время игры составило: ${new Date(resultTime * 1000).
				toISOString().substr((resultTime < 3600) ? 14 : 11,(resultTime < 3600) ? 5 : 8)}</p>
			<p>Количество ходов: ${movesCount}</p>`;
	document.querySelector('.afterWinChoose').classList.toggle('off');
}
function notifyLose(){
	clearInterval(timerId);
	clearInterval(checkOpponentsMove);
	playField.classList.toggle('off');
	document.querySelector('.playGround').classList.toggle('off');
	document.querySelector('.afterGameWrap').classList.toggle('off');
	document.querySelector('.afterGameInfo').classList.toggle('off');
	let loseReason = (score <= 0) ? 'Количество ваших очков упало ниже нуля' : 'Закончилось время';
	document.querySelector('.afterGameInfo').innerHTML = 
		`<h1>К сожалению вы проиграли<h1>
		<p>${loseReason}</p>
		<p>Количество ходов: ${movesCount}</p>`;
	document.querySelector('.afterWinChoose').classList.toggle('off');
}
function addZero(elem){
	return (elem < 10) ? '0' + String(elem) : String(elem);
}
function startTimer(sec,number){
	let timer = document.querySelector('.timer');
	let seconds = sec;
	timerId = setInterval(function(){
		if(seconds >= 0){
			seconds += number;
			currentTime = seconds;
		}
		else
			notifyLose(seconds);

		timer = document.querySelector('.timer').innerHTML = 'Время: ' + new Date(seconds * 1000).
						toISOString().substr(
							(seconds < 3600) ? 14 : 11,
							(seconds < 3600) ? 5 : 8
						);
		},1000);
}

document.getElementById('playAgain').addEventListener('click',function(){
	document.querySelector('.afterWinChoose').classList.toggle('off');
	document.querySelector('.afterGameWrap').classList.toggle('off');
	document.querySelector('.afterGameInfo').classList.toggle('off');
	playField.innerHTML = '';
	movesCount = 0;
	document.querySelector('.timer').innerHTML = '00:00';
	countdownTimerMode = false;
	calculationDurationMode = true;
	document.querySelector('.afterGameInfo').innerHTML = '';
	playField.classList.toggle('off');
	document.querySelector('.gameStart').classList.toggle('off');
	document.querySelector('.sizeInput').value = '';
	cardsCount = null;
});