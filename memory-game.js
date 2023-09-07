"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;

const gameBoard = document.getElementById("game");
const card = document.querySelector('.card');
const button = document.querySelectorAll('.button');
const start = document.querySelector('#start');
const difficulty = document.querySelector('#difficulty-screen');
const restartBtn = document.querySelector('#logo');
const winText = document.querySelector('#win-text');
const restartAnimation = document.querySelector('#restart');

let pairs = [];
let allMatches = document.querySelectorAll('.card.match');
let firstCard = null;
let winScreen = document.querySelector('#win-screen');
let number;
let preventClick = false;
let guesses = 0;
let guessDisplay = document.querySelector('#guesses');
let highScoreDisplay = document.querySelector('#high-score');
let highScore = 100000;
let winGuessDisplay = document.querySelector('#win-guess');
let ranColor;


function generateColorString() {
  let code = '';
  let temp;
  let rgb = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
  for (let value of rgb) {
    temp = value.toString();
    for (let i = temp.length; i < 3; i++) {
      temp = '0' + temp;
    }
    code += temp;
  }
  return code;
}

function generateArray(num, type) {
  number = num;
  pairs = [];
  let colorCurrent;
  let x = 0;
  while (x < num) {
    if (type == 'colors') {
      colorCurrent = generateColorString();
      pairs.push(colorCurrent);
      pairs.push(colorCurrent);
      x++;
    }
  }
  return pairs;
}
/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */
document.addEventListener('click', function (event) {
  if (event.target.nodeName === "BUTTON") {
    if (event.target.id === 'start') {
      difficulty.classList.toggle('hidden');
      event.target.classList.toggle('hidden');
    } else if (event.target.id === 'easy') {
      difficulty.classList.toggle('hidden');
      startGame(6, 'colors');
    } else if (event.target.id === 'medium') {
      difficulty.classList.toggle('hidden');
      startGame(10, 'colors');
    } else if (event.target.id === 'hard') {
      difficulty.classList.toggle('hidden');
      startGame(16, 'colors');
    }

  }
});


function createCards(array) {
  let newDiv = document.createElement("div");
  for (let value of array) {
    newDiv = document.createElement("div");
    newDiv.style.backgroundColor = `rgb(${value.slice(0, 3)}, ${value.slice(3, 6)},${value.slice(6)})`;
    newDiv.classList = `${value} face-down card`;
    gameBoard.append(newDiv);
  }
}

function startGame(num, type) {
  createCards(shuffle(generateArray(num, type)));
}

//FLIPPING CARD

gameBoard.addEventListener('click', function (event) {
  if (!preventClick) {
    if (event.target.classList.contains('card') && !event.target.classList.contains('match')) {
      event.target.classList.toggle('face-down');
      if (firstCard === null) {
        firstCard = event.target;
        preventClick = true;
        setTimeout(function () { preventClick = false; }, 300);
      } else {
        if (event.target !== firstCard) {
          checkMatch(event);
          guesses += 1;
          guessDisplay.textContent = `Guesses: ${guesses}`;
        } else {
          firstCard = null;
        }
        preventClick = true;
        setTimeout(function () { preventClick = false; }, 1000);
      };
    };
  }
});

//RESTART BTN //

restartBtn.addEventListener('click', function () {
  while (gameBoard.firstChild) {
    gameBoard.removeChild(gameBoard.firstChild);
  };
  guesses = 0;
  guessDisplay.textContent = `Guesses: ${guesses}`;
  winScreen.classList.toggle('hidden');
  difficulty.classList.toggle('hidden');
  winText.style.color = '#fff';
  restartAnimation.style.animation = 'none 5s ease-in-out -1s infinite';
});

//MATCH CHECKER //

function checkMatch(event) {
  if (firstCard.classList[0] === event.target.classList[0]) {
    event.target.classList.add('match');
    firstCard.classList.add('match');
    firstCard = null;
    checkWin();
  }
  else {
    setTimeout(function () {
      event.target.classList.toggle('face-down');
      firstCard.classList.toggle('face-down');
      firstCard = null;
    }, 1000);
  }
}
//WIN STATE //
function checkWin() {
  allMatches = document.querySelectorAll('.card.match');
  if (allMatches.length === pairs.length) {
    winScreen.classList.toggle('hidden');
    winScreen.classList.toggle('active');
    if (highScore > guesses) {
      highScore = guesses;
      highScoreDisplay.textContent = `High Score: ${guesses}`;
      winGuessDisplay.textContent = `Guesses: ${guesses}`;
      setInterval(function () {
        ranColor = generateColorString();
        winText.style.color = `rgb(${ranColor.slice(0, 3)}, ${ranColor.slice(3, 6)},${ranColor.slice(6)})`;
      }, 1000);
      restartAnimation.style.animation = 'spin 5s ease-in-out -1s infinite';
    }
  };
}

