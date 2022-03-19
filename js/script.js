'use strict';

let gameInfoWrap = document.querySelector('.gameInfoWrap');
let chooseModeWrap = document.querySelector('.chooseModeWrap');
let chooseTypeWrap = document.querySelector('.chooseTypeWrap');
let chooseSizeWrap = document.querySelector('.chooseSizeWrap');
let chooseDifficultyWrap = document.querySelector('.chooseDifficultyWrap');

let countdownTimerMode = false;
let calculationDurationMode = false;
let easyDifficulty = false;
let mediumDifficulty = false;
let hardDifficulty = false;
let smallField = false;
let normalField = false;
let bigField = false;

let playerName;
let difficulty;
let gameId;
let serverData;

let inputPlayerName = document.getElementById('inputPlayerName');
let inputId = document.getElementById('inputId');

inputPlayerName.addEventListener('input', function(){
	removeGameInfo.disabled = inputPlayerName.value === '';
});
inputId.addEventListener('input', function(){
	document.getElementById('joinGame').disabled = inputId.value === '';
});

let joinGame = document.querySelector('#joinGame');
joinGame.addEventListener('click',function(){
	fetch('ajax.php?id='+inputId.value)
		.then(data => data.json())
		.then(json => setData(json))

	gameInfoWrap.classList.toggle('off');
});

function setData(data){
	serverData = data;

	if(serverData.difficulty == 'Легкая сложность'){
		makeArray([6,6],2);
	}
	else if(serverData.difficulty == 'Средняя сложность'){
		makeArray([Number(serverData.cardsCount) / 3,Number(serverData.cardsCount) / 3],3);
	}
	else{
		makeArray([Number(serverData.cardsCount) / 4,Number(serverData.cardsCount) / 4],4);
	}
}

let removeGameInfo = document.querySelector('.removeGameInfo');
removeGameInfo.addEventListener('click',function(){
	playerName = inputPlayerName.value;
	gameInfoWrap.classList.toggle('off');
	chooseModeWrap.classList.toggle('off');
});

let mode1 = document.getElementById('mode1');
let mode2 = document.getElementById('mode2');

let removeChooseMode = document.querySelector('.removeChooseMode');
removeChooseMode.addEventListener('click',function(){
	if(checkOfTwoRadios(mode1,mode2)){
		if(mode1.checked)
			countdownTimerMode = true;
		else
			calculationDurationMode = true;

		chooseModeWrap.classList.toggle('off');
		chooseTypeWrap.classList.toggle('off');
	}
});

let type1 = document.getElementById('type1');
let type2 = document.getElementById('type2');

let getChosenType = document.querySelector('.getChosenType');
getChosenType.addEventListener('click',function(){
	if(checkOfTwoRadios(type1,type2)){
		chooseTypeWrap.classList.toggle('off');
		if(type1.checked)
			chooseSizeWrap.classList.toggle('off');
		else
			chooseDifficultyWrap.classList.toggle('off');
	}
});

let difficulty1 = document.getElementById('difficulty1');
let difficulty2 = document.getElementById('difficulty2');
let difficulty3 = document.getElementById('difficulty3');

let getChosenDifficulty = document.querySelector('.getChosenDifficulty');
getChosenDifficulty.addEventListener('click',function(){
	if(checkOfThreeRadios(difficulty1,difficulty2,difficulty3)){
		chooseDifficultyWrap.classList.toggle('off');
		if(difficulty1.checked)
			easyDifficulty = true;
		else if(difficulty2.checked)
			mediumDifficulty = true;
		else
			hardDifficulty = true;

		generateWithDifficulty();
	}
});

let size1 = document.getElementById('size1');
let size2 = document.getElementById('size2');
let size3 = document.getElementById('size3');

let getChosenSize = document.querySelector('.getChosenSize');
getChosenSize.addEventListener('click',function(){
	if(checkOfThreeRadios(size1,size2,size3)){
		chooseSizeWrap.classList.toggle('off');
		if(size1.checked)
			smallField = true;
		else if(size2.checked)
			normalField = true;
		else
			bigField = true;

		generateWithSize();
	}
});


function checkOfTwoRadios(argument1,argument2){
	if(!argument1.checked && !argument2.checked) {
		alert('Вы ничего не выбрали!');
		return false;
	}
	else
		return true;
}
function checkOfThreeRadios(argument1,argument2,argument3){
	if(!argument1.checked && !argument2.checked && !argument3.checked) {
		alert('Вы ничего не выбрали!');
		return false;
	}
	else
		return true;
}