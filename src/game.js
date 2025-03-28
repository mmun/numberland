import { playSound } from "./sounds.js";
import {
  DIFFICULTY_LEVELS,
  FEEDBACK_MESSAGES,
  REQUIRED_CORRECT_TO_ADVANCE,
} from "./constants.js";

// Create a game state object
const gameState = {
  currentRound: 0,
  score: 0,
  currentAnswer: 0,
  currentDifficultyIndex: 0,
  consecutiveCorrect: 0,
  consecutiveIncorrect: 0,
  gameStarted: false,
};

export function initGame() {
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

  // Start game immediately instead of showing level selection
  startGame();
}

function startGame() {
  // Show game container
  document.getElementById("game-container").classList.remove("hidden");

  // Reset game state
  gameState.currentRound = 0;
  gameState.score = 0;
  gameState.currentDifficultyIndex = 0; // Start with easiest difficulty
  gameState.consecutiveCorrect = 0;
  gameState.consecutiveIncorrect = 0;
  gameState.gameStarted = true;

  // Start first round
  generateProblem();
  updateDifficultyIndicator();
}

function generateProblem() {
  // Get current difficulty settings
  const currentDifficulty = DIFFICULTY_LEVELS[gameState.currentDifficultyIndex];
  const [min, max] = currentDifficulty.range;

  // Generate two random numbers based on the current difficulty
  const number1 = Math.floor(Math.random() * (max - min + 1)) + min;
  const number2 = Math.floor(Math.random() * (max - min + 1)) + min;

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
    gameState.consecutiveCorrect++;
    gameState.consecutiveIncorrect = 0;

    // Get a random positive feedback message
    const randomIndex = Math.floor(
      Math.random() * FEEDBACK_MESSAGES.correct.length
    );
    feedback.textContent = FEEDBACK_MESSAGES.correct[randomIndex];

    playSound("correct");
    showConfetti();

    // Increase difficulty after required number of consecutive correct answers
    if (
      gameState.consecutiveCorrect >= REQUIRED_CORRECT_TO_ADVANCE &&
      gameState.currentDifficultyIndex < DIFFICULTY_LEVELS.length - 1
    ) {
      gameState.currentDifficultyIndex++;
      gameState.consecutiveCorrect = 0; // Reset counter
      updateDifficultyIndicator(true); // Show upgrade animation
    }
  } else {
    gameState.consecutiveIncorrect++;
    gameState.consecutiveCorrect = 0;

    // Get a random encouraging feedback message
    const randomIndex = Math.floor(
      Math.random() * FEEDBACK_MESSAGES.incorrect.length
    );
    feedback.textContent = `${FEEDBACK_MESSAGES.incorrect[randomIndex]} The answer is ${gameState.currentAnswer}`;

    playSound("incorrect");
    showPoopEmoji();

    // Decrease difficulty after 2 consecutive incorrect answers
    if (
      gameState.consecutiveIncorrect >= 2 &&
      gameState.currentDifficultyIndex > 0
    ) {
      gameState.currentDifficultyIndex--;
      gameState.consecutiveIncorrect = 0; // Reset counter
      updateDifficultyIndicator(false); // Show downgrade animation
    }
  }

  // Hide check button and show next button
  document.getElementById("check-button").classList.add("hidden");
  document.getElementById("next-button").classList.remove("hidden");
}

function nextRound() {
  gameState.currentRound++;

  generateProblem();
  updateDifficultyIndicator();
}

function endGame() {
  // Hide game container and show result screen
  document.getElementById("game-container").classList.add("hidden");
  document.getElementById("result-screen").classList.remove("hidden");

  // Update final score
  document.getElementById("final-score").textContent = gameState.score;

  // Add message about reaching highest difficulty
  const maxDifficultyText = document.getElementById("max-difficulty-reached");
  if (gameState.currentDifficultyIndex === DIFFICULTY_LEVELS.length - 1) {
    maxDifficultyText.textContent = `Amazing! You reached the ${
      DIFFICULTY_LEVELS[gameState.currentDifficultyIndex].name
    } level!`;
    maxDifficultyText.classList.remove("hidden");
  } else {
    maxDifficultyText.classList.add("hidden");
  }

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
  // Hide result screen and show game container
  document.getElementById("result-screen").classList.add("hidden");
  document.getElementById("game-container").classList.remove("hidden");

  // Reset the game
  startGame();
}

function updateDifficultyIndicator(showAnimation = false) {
  const currentDifficulty = DIFFICULTY_LEVELS[gameState.currentDifficultyIndex];
  const difficultyText = document.getElementById("difficulty-level");
  const difficultyDesc = document.getElementById("difficulty-description");

  // Update the text content
  difficultyText.textContent = currentDifficulty.name;
  difficultyDesc.textContent = currentDifficulty.description;

  // Apply animation classes if requested
  if (showAnimation) {
    const isUpgrade = gameState.consecutiveCorrect === 0;

    difficultyText.classList.remove("difficulty-up", "difficulty-down");
    setTimeout(() => {
      difficultyText.classList.add(
        isUpgrade ? "difficulty-up" : "difficulty-down"
      );
    }, 10);
  }
}

function showConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

function showPoopEmoji() {
  // Fewer emojis for younger children - less overwhelming
  for (let i = 0; i < 3; i++) {
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
