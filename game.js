const emojis = ['🍎', '🍌', '🍇', '🍓', '🍍', '🥝', '🍒', '🍉'];
let cards = [...emojis, ...emojis]; // Duplicate for pairs
let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let timer;
let timeElapsed = 0;
let isTimerRunning = false;

const board = document.getElementById('game-board');
const moveCountEl = document.getElementById('move-count');
const timerEl = document.getElementById('timer');
const scoreForm = document.getElementById('score-form');
const leaderboard = document.getElementById('leaderboard');
const playerNameInput = document.getElementById('player-name');

// Shuffle cards
function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function startTimer() {
  isTimerRunning = true;
  timer = setInterval(() => {
    timeElapsed++;
    timerEl.textContent = timeElapsed;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  isTimerRunning = false;
}

function renderBoard() {
  board.innerHTML = '';
  cards = shuffle(cards);
  cards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = index;
    card.dataset.emoji = emoji;
    card.innerHTML = '?';
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
}

function flipCard(e) {
  const card = e.currentTarget;
  const emoji = card.dataset.emoji;

  if (card.classList.contains('flipped') || flippedCards.length === 2) return;

  card.textContent = emoji;
  card.classList.add('flipped');
  flippedCards.push(card);

  if (!isTimerRunning) startTimer();

  if (flippedCards.length === 2) {
    moves++;
    moveCountEl.textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.emoji === card2.dataset.emoji) {
    matchedCount++;
    flippedCards = [];
    if (matchedCount === emojis.length) {
      stopTimer();
      setTimeout(() => {
        alert('🎉 You won!');
        scoreForm.style.display = 'block';
      }, 300);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      card1.textContent = '?';
      card2.textContent = '?';
      flippedCards = [];
    }, 800);
  }
}

// Save to localStorage
scoreForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const playerName = playerNameInput.value.trim();
    if (!playerName) return;
  
    const score = {
      name: playerName,
      moves: moves,
      time: timeElapsed,
      date: new Date().toLocaleString()
    };
  
    const scores = JSON.parse(localStorage.getItem('memoryScores')) || [];
    scores.push(score);
    localStorage.setItem('memoryScores', JSON.stringify(scores));
  
    scoreForm.style.display = 'none';
    document.getElementById('share-score').style.display = 'block'; // 👈 show share options
  
    renderLeaderboard();
    resetGame();
  });
  

function renderLeaderboard() {
  const scores = JSON.parse(localStorage.getItem('memoryScores')) || [];
  const sorted = scores.sort((a, b) => {
    if (a.moves === b.moves) return a.time - b.time;
    return a.moves - b.moves;
  }).slice(0, 5);

  leaderboard.innerHTML = '';
  sorted.forEach(score => {
    const li = document.createElement('li');
    li.textContent = `${score.name} - ${score.moves} moves - ${score.time}s`;
    leaderboard.appendChild(li);
  });
}

function resetGame() {
  moves = 0;
  matchedCount = 0;
  flippedCards = [];
  timeElapsed = 0;
  timerEl.textContent = 0;
  moveCountEl.textContent = 0;
  playerNameInput.value = '';
  renderBoard();
}
function shareScore() {
    const name = playerNameInput.value.trim();
    const message = `🎮 I just completed the Memory Match game in ${moves} moves and ${timeElapsed} seconds! Can you beat me?\nPlay here: https://amarsingh98.github.io/memory-game/`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
  
  function shareOnTwitter() {
    const message = `🎯 I finished the Memory Match game in ${moves} moves and ${timeElapsed}s! Try to beat me!\nPlay here: https://amarsingh98.github.io/memory-game/`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
  

renderBoard();
renderLeaderboard();


