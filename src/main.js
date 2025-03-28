import "./style.css";
import { initGame } from "./game.js";
import confetti from "canvas-confetti";
window.confetti = confetti;

document.querySelector("#app").innerHTML = `
  <div class="container">
    <h1>Numberland</h1>
    
    <div id="game-container" class="game-container">
      <div class="difficulty-indicator">
        <div class="difficulty-level-container">
          <span>Level: </span>
          <span id="difficulty-level" class="difficulty-level">Starter</span>
        </div>
        <p id="difficulty-description" class="difficulty-description">Small numbers you can count on one hand!</p>
      </div>
      
      <div class="equation">
        <span id="number1" class="equation-number">1</span>
        <span>+</span>
        <span id="number2" class="equation-number">1</span>
        <span>=</span>
        <input id="answer-input" class="answer-input" type="number" min="0" max="99">
      </div>
      
      <button id="check-button" class="check-button">Check Answer</button>
      <div id="feedback" class="feedback"></div>
      <button id="next-button" class="next-button hidden">Next Problem</button>
    </div>
    
    <div id="result-screen" class="result-screen hidden">
      <h2 class="result-title">Great Job!</h2>
      <p>You got <span id="final-score" class="score">0</span> out of 10 correct!</p>
      <p id="max-difficulty-reached" class="max-difficulty-message"></p>
      <button id="play-again-button" class="play-again-button">Play Again</button>
    </div>
  </div>
`;

initGame();
