const canvas = document.getElementById("gameCanvas");
let scoreBoard = document.getElementById("scoreBoard");

let score = 0;
let lives = 3;
let gameInterval;
let timerInterval;
let timer = 60; // 1 minute in seconds

// Vegetable images
const vegetables = ["🍎", "🧅", "🍈", "🍐", "🍅", "🥦", "🌽", "🍆", "🍋", "🍉", "🍓", "🫐", "🍊", "🍑", "🥥", "🍏"];

let isScratching = false;
let lastMouseX = 0;
let lastMouseY = 0;

function createVegetable() {
  if (lives <= 0) return;

  const vegetable = document.createElement("div");
  vegetable.classList.add("vegetable");
  vegetable.textContent = vegetables[Math.floor(Math.random() * vegetables.length)];

  // Set initial position
  vegetable.style.left = Math.random() * (window.innerWidth - 50) + "px";
  vegetable.style.top = "-50px";

  canvas.appendChild(vegetable);

  let speed = Math.random() * 1 + 0.5; // Random speed

  function fall() {
    let top = parseFloat(vegetable.style.top);

    if (top > window.innerHeight) {
      // Vegetable falls off the screen; simply remove it
      vegetable.remove();
    } else if (vegetable.parentElement) {
      vegetable.style.top = top + speed + "px";
      requestAnimationFrame(fall);
    }
  }
  fall();
}

// Detect scratching
canvas.addEventListener("mousedown", () => {
  isScratching = true;
});
canvas.addEventListener("mouseup", () => {
  isScratching = false;
});
canvas.addEventListener("mousemove", (event) => {
  if (isScratching) {
    const vegetables = document.querySelectorAll(".vegetable");

    // Only add points if the mouse has moved (horizontal or vertical movement)
    if (event.clientX !== lastMouseX || event.clientY !== lastMouseY) {
      vegetables.forEach((vegetable) => {
        const rect = vegetable.getBoundingClientRect();

        // Check if the mouse is over the vegetable horizontally and vertically
        if (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom &&
          !vegetable.classList.contains("scratched")
        ) {
          vegetable.classList.add("scratched");
          score += 10; // Add points for scratching
          vegetable.style.animation = "bounce 0.3s"; // Add bounce effect
          setTimeout(() => vegetable.remove(), 300); // Remove after bounce
          updateScoreBoard();
        }
      });
    }

    // Update lastMouseX and lastMouseY to the current mouse position
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
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
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  setTimeout(() => {
    alert("Game Over! Your score: " + score);
    resetGame();
  }, 500);
}

function resetGame() {
  score = 0;
  lives = 3;
  timer = 60;

  const vegetables = document.querySelectorAll(".vegetable");
  vegetables.forEach((vegetable) => vegetable.remove());

  clearInterval(gameInterval);
  clearInterval(timerInterval);

  updateScoreBoard();
  startGame();
}

function startGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);

  gameInterval = setInterval(createVegetable, 1000);

  timerInterval = setInterval(() => {
    timer--;
    updateScoreBoard();
    if (timer <= 0) {
      clearInterval(timerInterval);
      checkGameOver();
    }
  }, 1000);

  updateScoreBoard();
}

startGame();
