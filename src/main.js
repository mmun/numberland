import "./style.css";
import { initGame } from "./game.js";
import confetti from "canvas-confetti";
window.confetti = confetti;

document.querySelector("#app").innerHTML = `
  <div class="container">
    <h1>Numberland</h1>
    <div id="level-select" class="level-selection">
      <h2>Choose a level:</h2>
      <button class="level-button" data-max="3">Level 1: Numbers 1-3</button>
      <button class="level-button" data-max="5">Level 2: Numbers 1-5</button>
      <button class="level-button" data-max="9">Level 3: Numbers 1-9</button>
      <button class="level-button" data-max="15">Level 4: Numbers 1-15</button>
      <button class="level-button" data-max="19">Level 5: Numbers 1-19</button>
    </div>
    
    <div id="game-container" class="game-container hidden">
      <div class="progress-bar">
        <div id="progress-fill" class="progress-fill" style="width: 0%"></div>
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
      <button id="play-again-button" class="play-again-button">Play Again</button>
    </div>
  </div>
`;

initGame();
