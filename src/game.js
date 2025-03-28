import { playSound } from "./sounds.js";

const TOTAL_ROUNDS = 10;

// Create a game state object instead of separate variables
const gameState = {
  currentMax: 0,
  currentRound: 0,
  score: 0,
  currentAnswer: 0,
  gameStarted: false,
};

export function initGame() {
  // Add event listeners for level selection
  document.querySelectorAll(".level-button").forEach((button) => {
    button.addEventListener("click", () => {
      gameState.currentMax = parseInt(button.dataset.max);
      startGame();
    });
  });

  // Add event listener for check button
  document
    .getElementById("check-button")
    .addEventListener("click", checkAnswer);

  // Add event listener for next button
  document.getElementById("next-button").addEventListener("click", nextRound);

  // Add event listener for play again button
  document
    .getElementById("play-again-button")
    .addEventListener("click", resetGame);

  // Add keyboard support
  document.getElementById("answer-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      if (document.getElementById("next-button").classList.contains("hidden")) {
        checkAnswer();
      } else {
        nextRound();
      }
    }
  });
}

function startGame() {
  // Hide level selection and show game
  document.getElementById("level-select").classList.add("hidden");
  document.getElementById("game-container").classList.remove("hidden");

  // Reset game state
  gameState.currentRound = 0;
  gameState.score = 0;
  gameState.gameStarted = true;

  // Start first round
  generateProblem();
  updateProgressBar();
}

function generateProblem() {
  // Generate two random numbers based on the level
  const number1 = Math.floor(Math.random() * gameState.currentMax) + 1;
  const number2 = Math.floor(Math.random() * gameState.currentMax) + 1;

  // Display the numbers
  document.getElementById("number1").textContent = number1;
  document.getElementById("number2").textContent = number2;

  // Calculate the answer
  gameState.currentAnswer = number1 + number2;

  // Clear the input field and focus on it
  const answerInput = document.getElementById("answer-input");
  answerInput.value = "";
  answerInput.focus();

  // Clear feedback
  document.getElementById("feedback").textContent = "";

  // Hide next button and show check button
  document.getElementById("check-button").classList.remove("hidden");
  document.getElementById("next-button").classList.add("hidden");
}

function checkAnswer() {
  const answerInput = document.getElementById("answer-input");
  const userAnswer = parseInt(answerInput.value);

  if (isNaN(userAnswer)) {
    document.getElementById("feedback").textContent = "Please enter a number!";
    return;
  }

  const isCorrect = userAnswer === gameState.currentAnswer;
  const feedback = document.getElementById("feedback");

  if (isCorrect) {
    gameState.score++;
    feedback.textContent = "✅ Correct!";
    playSound("correct");
    showConfetti();
  } else {
    feedback.textContent = `❌ Oops! The answer is ${gameState.currentAnswer}`;
    playSound("incorrect");
    showPoopEmoji();
  }

  // Hide check button and show next button
  document.getElementById("check-button").classList.add("hidden");
  document.getElementById("next-button").classList.remove("hidden");
}

function nextRound() {
  gameState.currentRound++;

  if (gameState.currentRound >= TOTAL_ROUNDS) {
    endGame();
  } else {
    generateProblem();
    updateProgressBar();
  }
}

function endGame() {
  // Hide game container and show result screen
  document.getElementById("game-container").classList.add("hidden");
  document.getElementById("result-screen").classList.remove("hidden");

  // Update final score
  document.getElementById("final-score").textContent = gameState.score;

  // Celebrate if they did well
  if (gameState.score >= 7) {
    playSound("victory");
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const interval = setInterval(function () {
      if (Date.now() > animationEnd) {
        return clearInterval(interval);
      }
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 250);
  }
}

function resetGame() {
  // Hide result screen and show level selection
  document.getElementById("result-screen").classList.add("hidden");
  document.getElementById("level-select").classList.remove("hidden");
  gameState.gameStarted = false;
}

function updateProgressBar() {
  const progressPercentage = (gameState.currentRound / TOTAL_ROUNDS) * 100;
  document.getElementById(
    "progress-fill"
  ).style.width = `${progressPercentage}%`;
}

function showConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

function showPoopEmoji() {
  for (let i = 0; i < 5; i++) {
    const poop = document.createElement("div");
    poop.className = "emoji";
    poop.textContent = "💩";
    poop.style.left = `${Math.random() * 100}vw`;
    document.body.appendChild(poop);

    // Remove after animation completes
    setTimeout(() => {
      poop.remove();
    }, 2000);
  }
}
