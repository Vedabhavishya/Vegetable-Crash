const canvas = document.getElementById("gameCanvas");
let scoreBoard = document.getElementById("scoreBoard");

let score = 0;
let lives = 3;
let gameInterval;
let timerInterval;
let timer = 60; // 1 minute in seconds

// Vegetable images
const vegetables = ["🍎", "🧅", "🍈", "🍐", "🍅", "🥦", "🌽", "🍋", "🍉", "🍓", "🫐", "🍊", "🍑", "🥥", "🍏"];

function createVegetable() {
  if (lives <= 0) return; // Stop creating vegetables if the game is over

  const vegetable = document.createElement("div");
  vegetable.classList.add("vegetable");
  vegetable.textContent = vegetables[Math.floor(Math.random() * vegetables.length)];

  // Set initial position
  vegetable.style.left = Math.random() * (window.innerWidth - 50) + "px";
  vegetable.style.top = "-50px";

  canvas.appendChild(vegetable);

  // Animate falling
  let speed = Math.random() * 1 + 0.5; // Random speed
  function fall() {
    let top = parseFloat(vegetable.style.top);
    if (top > window.innerHeight) {
      // Check if the vegetable wasn't clicked
      if (!vegetable.classList.contains("clicked") && lives > 0) {
        lives -= 1; // Deduct a life
        updateScoreBoard();
        if (lives <= 0) {
          checkGameOver();
        }
      }
      vegetable.remove(); // Remove the vegetable after it falls out
    } else if (vegetable.parentElement) {
      vegetable.style.top = top + speed + "px";
      requestAnimationFrame(fall);
    }
  }
  fall();

  // Add click event
  vegetable.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent canvas click event from triggering
    if (!vegetable.classList.contains("clicked")) {
      vegetable.classList.add("clicked");
      score += 10; // Add points for clicking
      vegetable.style.animation = "bounce 0.3s"; // Add bounce effect
      setTimeout(() => vegetable.remove(), 300); // Remove after
      updateScoreBoard();
    }
  });
}

// Detect clicks outside vegetables
canvas.addEventListener("click", (event) => {
  if (lives > 0) {
    if (!event.target.classList.contains("vegetable")) {
      lives -= 1; // Lose a life for clicking outside vegetables
      updateScoreBoard();
      if (lives <= 0) {
        checkGameOver();
      }
    }
  }
});

function updateScoreBoard() {
  if (!scoreBoard) {
    scoreBoard = document.createElement("div");
    scoreBoard.id = "scoreBoard";
    document.body.insertBefore(scoreBoard, canvas);
  }
  scoreBoard.textContent = `Score: ${score} | Lives: ${lives} | Time: ${timer}s`;
}

function checkGameOver() {
  // Stop creating new vegetables
  clearInterval(gameInterval);

  // Allow vegetables to finish animations but stop deducting lives
  setTimeout(() => {
    alert("Game Over! Your score: " + score);
    resetGame();
  }, 500);
}

function resetGame() {
  score = 0;
  lives = 3;
  timer = 60;

  // Clear all vegetables
  const vegetables = document.querySelectorAll(".vegetable");
  vegetables.forEach((vegetable) => vegetable.remove());

  // Clear all intervals
  clearInterval(gameInterval);
  clearInterval(timerInterval);

  // Update the scoreboard
  updateScoreBoard();

  // Restart the game
  startGame();
}

function startGame() {
  // Ensure intervals are cleared before starting new ones
  clearInterval(gameInterval);
  clearInterval(timerInterval);

  // Generate vegetables every second
  gameInterval = setInterval(createVegetable, 1000);

  // Start the timer countdown
  timerInterval = setInterval(() => {
    timer--;
    updateScoreBoard();
    if (timer <= 0) {
      clearInterval(timerInterval);
      checkGameOver();
    }
  }, 1000);

  updateScoreBoard(); // Ensure the scoreboard is updated at the start
}

startGame();
