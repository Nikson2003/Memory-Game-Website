const startBtn = document.getElementById('startBtn');
const gameBoard = document.getElementById('gameBoard');
const timerDisplay = document.getElementById('timer');
const difficultySelect = document.getElementById('difficulty');

let firstCard, secondCard;
let lockBoard = false;
let flippedCards = 0;
let matchedPairs = 0;
let timer;
let totalTime = 0;

const difficulties = {
    easy: { pairs: 6, timeLimit: 60 },
    medium: { pairs: 9, timeLimit: 60 },
    hard: { pairs: 9, timeLimit: 45 },
};

startBtn.addEventListener('click', startGame);

function startGame() {
    const difficulty = difficultySelect.value;
    const { pairs, timeLimit } = difficulties[difficulty];
    
    matchedPairs = 0;
    flippedCards = 0;
    totalTime = timeLimit;

    gameBoard.innerHTML = '';
    gameBoard.className = `game-board ${difficulty}`;

    const cards = generateCards(pairs);
    shuffle(cards);

    cards.forEach(card => gameBoard.appendChild(card));

    // Show cards for 2 seconds at the start
    setTimeout(() => {
        cards.forEach(card => card.classList.add('back'));
        lockBoard = false; // Allow interaction after 2 seconds
    }, 2000);

    startTimer();
}

function generateCards(pairs) {
    const cards = [];
    for (let i = 1; i <= pairs; i++) {
        cards.push(createCard(i));
        cards.push(createCard(i));
    }
    return cards;
}

function createCard(number) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.number = number;
    card.innerText = number;
    card.addEventListener('click', flipCard);
    return card;
}

function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains('matched')) return;

    this.classList.remove('back');
    this.classList.add('flipped');
    flippedCards++;

    if (flippedCards === 1) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.number === secondCard.dataset.number;
    if (isMatch) {
        disableCards();
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
    matchedPairs++;

    if (matchedPairs === gameBoard.children.length / 2) {
        clearInterval(timer);
        alert('Congratulations! You won!');
    }
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        firstCard.classList.add('back');
        secondCard.classList.remove('flipped');
        secondCard.classList.add('back');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
    flippedCards = 0;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        totalTime--;
        updateTimerDisplay();
        if (totalTime <= 0) {
            clearInterval(timer);
            alert('Time is up! You lost!');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(totalTime / 60).toString().padStart(2, '0');
    const seconds = (totalTime % 60).toString().padStart(2, '0');
    timerDisplay.innerText = `Time: ${minutes}:${seconds}`;
}
