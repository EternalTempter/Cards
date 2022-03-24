'use strict';
var cardCords = [];

let removedCards = [];

let timerId;
let time = 0;

let score;
let scoreMultiplier;
let movesCount = 0;

let timeout;
let winInterval;

let calculateDurationInterval;

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
		array.push(String(i) + '.jpg');
	}
	return array;
}
function getSettingsByDifficulty(randomArray,cardRange,multipliedArray,images){
	if(difficulty == 'Легко'){
		randomArray = randomizeArray([cardRange[0],cardRange[1]],images,randomArray);
		multipliedArray = multiplyArray(randomArray,2);
		time = 100;
	}
	else if(difficulty == 'Средне'){
		randomArray = randomizeArray([cardRange[0],cardRange[1]],images,randomArray);	
		multipliedArray = multiplyArray(randomArray,3);
		time = 200;
	}
	else if(difficulty == 'Сложно'){
		randomArray = randomizeArray([cardRange[0],cardRange[1]],images,randomArray);
		multipliedArray = multiplyArray(randomArray,4);
		time = 300;
	}
	else{
		randomArray = randomizeArray([cardRange[0] / 2,cardRange[1] / 2],images,randomArray);
		multipliedArray = multiplyArray(randomArray,2);
		difficulty = 'Пользовательская';
		time = 150;
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
	return (randomArray.includes(images[number])) ? checkForUnique(getRandomNumber(0,29),images,randomArray) : (number + 1) + '.jpg';
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
	for(let i = 0;i < array.length;i++){
		playField.innerHTML += '<img src="img/' + array[i] + '" class="closed bordered size">';
	}
}
function setStartScore(){
	scoreMultiplier = getRandomNumber(1,100);
	score = (playField.childElementCount * scoreMultiplier) / 3;
	document.querySelector('.scoreCount').innerHTML = `Количество очков: ${score}`;
}
function getRandomNumber(min,max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function sendRequest(content)
{
	return await fetch('ajax.php?do=put', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json;charset=utf-8",
			},
			body: content
		})
    .then(response => response.json())
  	.then(data => putServerData(JSON.parse(data)));
}
function putServerData(data){
	setTimeout(() => {
		serverData = data;
		if(serverGame){
			document.querySelector('.gameId').innerHTML = 'Уникальный идентификатор игры: ' + serverData.id;
			setInterval(function(){
				fetch('ajax.php?say=cards&cords='+ cardCords +'&id='+serverData.id+'&user='+ playerName+'&do=checkMove'+'&removedCards=' + JSON.stringify(removedCards))
					.then(response => response.json())
					.then(json => removeCards(json))
					.then(json => console.log(json));
			},500)
		}
	},200);
}
function setClickEvents(){
	if(!isJoined)
		sendRequest(JSON.stringify({name:playerName, difficulty:difficulty, cardsCount:playField.childElementCount}));
	else{
		sendRequest(JSON.stringify({name:playerName, difficulty:difficulty, cardsCount:playField.childElementCount,id:Number(document.getElementById('inputId').value)}));
	}
	playField = document.querySelector('.playField');
	for(let i = 0; i < playField.childElementCount;i++){
		playField.children[i].addEventListener('click',function(){
				playField.children[i].classList.toggle('opened');
				playField.children[i].classList.toggle('closed');
				if(difficulty == 'Легко' || serverData.difficulty == 'Легкая сложность' || difficulty == 'Пользовательская')
					compareCards(playField.children[i],2);
				if(difficulty == 'Средне' || serverData.difficulty == 'Средняя сложность')
					compareCards(playField.children[i],3);
				if(difficulty == 'Сложно' || serverData.difficulty == 'Сложная сложность')
					compareCards(playField.children[i],4);

		});
	}

	if(serverGame)
		setTimeout(() => buildOpponentsField(playField.childElementCount), 100);
}
function compareCards(card,times){
	let openedCards = [];
	playField.childNodes.forEach(card => card.classList.remove('pointerEventOff'));
	for(let i = 0;i < playField.childElementCount;i++){
		if(playField.children[i].classList.contains('opened')){
			playField.children[i].classList.toggle('pointerEventOff');
			openedCards.push(playField.children[i]);
		}
	}
	if(openedCards.length == times){
		movesCount++;
		document.querySelector('.movesCount').innerHTML = `Количество ходов: ${movesCount}`;
		playField.style.pointerEvents = 'none';
		for(let i = 0;i < openedCards.length; i++){
			if(openedCards[0].src == openedCards[i].src){}
			else{
				if(score > 0){
					score -= scoreMultiplier;
					document.querySelector('.scoreCount').innerHTML = `Количество очков: ${score}`;
				}
				else{
					notifyLose();
				}
				closeCards(openedCards);
				return;
			}
		}
		score += times * scoreMultiplier;
		document.querySelector('.scoreCount').innerHTML = `Количество очков: ${score}`;
		getCardCords(openedCards);
		setTimeout(() => playField.childNodes.forEach(card => card.classList.remove('opened')),500);
		hideCards(openedCards);
		setTimeout(() => playField.style.pointerEvents = 'auto',500);
		setTimeout(checkForWin,500);
		return;
	}
}
function getCardCords(cards){
	cardCords = [];
	for(let i=0; i<cards[0].parentNode.childNodes.length; ++i) {
		cards.forEach(card => {
			if(cards[0].parentNode.childNodes.item(i) != card)
				return;
			else
				cardCords.push(i);
		});
	}
	if (cardCords.length > 0 && serverGame) {
		sendRequest(JSON.stringify({name:playerName, cords: cardCords, id: serverData.id}));
	}
}
function removeCards(positions){
	setTimeout(function(){
		if(positions != 'Игрок не походил'){
			if(removedCards.includes(positions[0]) && removedCards.includes(positions[1])){
				removedCards.splice(removeCards.indexOf(positions[0]),1);
				removedCards.splice(removeCards.indexOf(positions[1]),1);
			}
			else{
				removedCards = removedCards.concat(positions);
			}

			console.log(positions,removedCards);
			let opponentsField = document.querySelector('.opponentsField');
			positions.forEach(position => {
				for(let i=0; i < opponentsField.childNodes.length; ++i) {
					if (position == i) {
						opponentsField.childNodes[i+1].classList.toggle('hide');
					}
				}
			});
		}
	},200);
}
function closeCards(array){
	setTimeout(function(){
		array.forEach(card => {
			card.classList.toggle('pointerEventOff');
			card.classList.toggle('opened');
			card.classList.toggle('closed');
		});
		playField.style.pointerEvents = 'auto';
		clearInterval(this);
	},500);
}
function hideCards(array){
	array.forEach(card => {
		card.classList.toggle('hide');
	});
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
	playField.classList.toggle('off');
	document.querySelector('.gameInfo').classList.toggle('off');
	document.querySelector('.afterGameInfo').innerHTML = 
			`<h1>Поздравляю, вы выиграли!<h1>
			<p>Время игры составило: ${document.querySelector('.timer').innerHTML}</p>
			<p>Количество ходов: ${movesCount}</p>`;
}
function notifyLose(){
	clearInterval(timerId);
	playField.classList.toggle('off');
	document.querySelector('.gameInfo').classList.toggle('off');
	let loseReason = (movesCount < 0) ? 'Количество ваших очков упало до нуля' : 'Закончилось время';
	document.querySelector('.afterGameInfo').innerHTML = 
		`<h1>К сожалению вы проиграли<h1>
		<p>${loseReason}</p>
		<p>Количество ходов: ${movesCount}</p>`;
}
function addZero(elem){
	return (elem < 10) ? '0' + String(elem) : String(elem);
}
function startTimer(sec,number){
	let timer = document.querySelector('.timer').classList.toggle('off');
	let seconds = sec;
	timerId = setInterval(function(){
		if(seconds >= 0)
			seconds += number;
		else
			notifyLose(seconds);

		timer = document.querySelector('.timer').innerHTML = new Date(seconds * 1000).
						toISOString().substr(
							(seconds < 3600) ? 14 : 11,
							(seconds < 3600) ? 5 : 8
						);
		},1000);
}

function buildOpponentsField(cardsCount){
	document.querySelector('.opponentsField').classList.toggle('off');
	document.querySelector('.opponentsLabel').classList.toggle('off');
	for(let i = 0;i < Number(cardsCount); i++){
		let opponentsField = document.querySelector('.opponentsField').innerHTML += '<div class="opponentsCard"></div>';
	}
}
