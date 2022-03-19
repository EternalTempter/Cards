'use strict';
let images = [];
let randomArray = [];

let easyTurns = 0;
let mediumTurns = 0;
let hardTurns = 0;
let firstCard;
let secondCard;
let thirdCard;
let forthCard;

let timerId;

let score;

let timeout;
let winInterval;

let calculateDurationInterval;

let playField = document.querySelector('.playField');
for(let i = 1;i <= 30; i++){
	images.push(String(i) + '.jpg');
}
function generateWithDifficulty(){
	startTimer();

	if(easyDifficulty){
		difficulty = 'Легкая сложность';
		makeArray([6,6],2);
	}
	else if(mediumDifficulty){
		difficulty = 'Средняя сложность';
		makeArray([10,30],3);
	}
	else{
		difficulty = 'Сложная сложность';
		makeArray([10,20],4);
	}
}

function makeArray(range,cloneTimes){
	for(let i = 1;i <= getRandomNumber(range[0],range[1]); i++){
		randomArray.push(images[checkForUnique(getRandomNumber(0,29))]);
	}
	let multipliedArray = randomArray;
	for(let i = 0;i < cloneTimes - 1;i++){
		multipliedArray = multipliedArray.concat(randomArray);
	}
	shuffle(multipliedArray);
	buildField(multipliedArray);
	setEvents();
}
function buildField(array){
	for(let i = 0;i < array.length;i++){
		playField.innerHTML += '<img src="img/' + array[i] + '" class="closed bordered size">';
	}
}
function shuffle(array) {
  	for (let i = array.length - 1; i > 0; i--) {
    	let j = Math.floor(Math.random() * (i + 1)); 
    	[array[i], array[j]] = [array[j], array[i]];
  	}
	console.log(array);
}
function getRandomNumber(min,max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function checkForUnique(number){	
	console.log(number);
	if(randomArray.includes(images[number])){
		return checkForUnique(getRandomNumber(0,29));
	}
	else
		return number;
}

async function sendRequest(content)
{
	return await fetch('ajax.php', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json;charset=utf-8",
			},
			body: content
		})
    .then(response => response.json())
  	.then(data => console.log(data));
}
function setEvents(){
	sendRequest(JSON.stringify({name:playerName, difficulty:difficulty, cardsCount:playField.childElementCount}));

	playField = document.querySelector('.playField');
	for(let i = 0; i < playField.childElementCount;i++){
		playField.children[i].addEventListener('click',function(){
			console.log(difficulty)
				playField.children[i].classList.toggle('opened');
				playField.children[i].classList.toggle('closed');
				if(easyDifficulty || serverData.difficulty == 'Легкая сложность')
					compareCardsForEasy(playField.children[i]);
				if(mediumDifficulty || serverData.difficulty == 'Средняя сложность')
					compareCardsForMedium(playField.children[i]);
				if(hardDifficulty || serverData.difficulty == 'Сложная сложность')
					compareCardsForHard(playField.children[i]);

		});
	}

	//setTimeout(() => buildOpponentsField(JSON.parse(localStorage.getItem('cardsCount'))), 100);
}
function compareCardsForEasy(elem){
	if(easyTurns == 0){
		firstCard = elem;
		firstCard.classList.toggle('pointerEventOff');
	}
	if(easyTurns == 1){
		secondCard = elem;
		secondCard.classList.toggle('pointerEventOff');
		playField.style.pointerEvents = 'none';
		if(firstCard.src == secondCard.src){
			getCardCords([firstCard,secondCard]);
			hideCards([firstCard,secondCard]);
			easyTurns = 0;
			playField.style.pointerEvents = 'auto';
			setTimeout(checkForWin,500);
			return;
		}
		else{
			closeCards([firstCard,secondCard]);
			easyTurns = 0;
			return;
		}
	}
	easyTurns++;
}
function compareCardsForMedium(elem){
	if(mediumTurns == 0){
		firstCard = elem;
		firstCard.classList.toggle('pointerEventOff');
	}
	if(mediumTurns == 1){
		secondCard = elem;
		secondCard.classList.toggle('pointerEventOff');
	}
	if(mediumTurns == 2){
		thirdCard = elem;
		thirdCard.classList.toggle('pointerEventOff');
		playField.style.pointerEvents = 'none';
		if(firstCard.src == secondCard.src && firstCard.src == thirdCard.src){
			getCardCords([firstCard,secondCard,thirdCard]);
			hideCards([firstCard,secondCard,thirdCard]);
			mediumTurns = 0;
			playField.style.pointerEvents = 'auto';
			checkForWin();
			return;
		}
		else{
			closeCards([firstCard,secondCard,thirdCard]);
			mediumTurns = 0;
			return;
		}
	}
	mediumTurns++;
}
function compareCardsForHard(elem){
	if(hardTurns == 0){
		firstCard = elem;
		firstCard.classList.toggle('pointerEventOff');
	}
	if(hardTurns == 1){
		secondCard = elem;
		secondCard.classList.toggle('pointerEventOff');
	}
	if(hardTurns == 2){
		thirdCard = elem;
		thirdCard.classList.toggle('pointerEventOff');
	}
	if(hardTurns == 3){
		forthCard = elem;
		forthCard.classList.toggle('pointerEventOff');
		playField.style.pointerEvents = 'none';
		if(firstCard.src == secondCard.src && firstCard.src == thirdCard.src && firstCard.src == forthCard.src){
			getCardCords([firstCard,secondCard,thirdCard,forthCard]);
			hideCards([firstCard,secondCard,thirdCard,forthCard]);
			hardTurns = 0;
			sendRequest();
			playField.style.pointerEvents = 'auto';
			checkForWin();
			return;
		}
		else{
			closeCards([firstCard,secondCard,thirdCard,forthCard]);
			hardTurns = 0;
			return;
		}
	}
	hardTurns++;
}
function getCardCords(cards){
	console.log(cards);
	let cardCords = [];
	for(let i=0; i<cards[0].parentNode.childNodes.length; ++i) {
		cards.forEach(card => {
			if(cards[0].parentNode.childNodes.item(i) != card)
				return;
			else
				cardCords.push(i-2);
		});
	}
	if (cardCords.length > 0) {
		console.log(cardCords,JSON.stringify(cardCords));
		sendRequest(JSON.stringify({name:'asdfafasgsagsag', cords: cardCords, id: gameId}));
		//setTimeout(()=>removeCards(JSON.parse(localStorage.getItem('cardsCords'))),100);
	}
}
function removeCards(positions){
	let opponentsField = document.querySelector('.opponentsField');
	positions.forEach(position => {
		for(let i=0; i < opponentsField.childNodes.length; ++i) {
			if (position == i) {
				opponentsField.childNodes[i].classList.toggle('hide');
			}
		}
	});
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
		if(playField.children[i].classList.contains('hide')){
		}
		else{	
			return;	
		}
	}
	console.log('Вы выиграли');
	winAlert();
}
function winAlert(){
	alert('Победа! Вы прошли уровень за ' + addZero(minutes) + ' : ' + addZero(seconds));
	clearInterval(calculateDurationInterval);
	clearInterval(winInterval);
}
function addZero(elem){
	return (elem < 10) ? '0' + String(elem) : String(elem);
}
function startTimer(){
	let timer = document.querySelector('.timer').classList.toggle('off');
	let seconds = 0;
	let timerId = setInterval(function(){
		seconds++;
		timer = document.querySelector('.timer').innerHTML = new Date(seconds * 1000).
						toISOString().substr(
							(seconds < 3600) ? 14 : 11,
							(seconds < 3600) ? 5 : 8
						);
		},1000);
}

function buildOpponentsField(cardsCount){
	for(let i = 0;i < Number(cardsCount); i++){
		let opponentsField = document.querySelector('.opponentsField').innerHTML += '<div class="opponentsCard"></div>';
	}
}

// setInterval(function(){
// 	fetch('ajax.php?say=steps&id='+gameId+'user='+)
// 		.then()
// },100)