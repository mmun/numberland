import React, { useEffect } from 'react';
import { playSound } from '../utils/sounds';
import confetti from 'canvas-confetti';

function ResultScreen({ score, totalRounds, maxDifficultyReached, difficultyName, onPlayAgain }) {
  const successThreshold = Math.floor(totalRounds * 0.7);
  
  useEffect(() => {
    if (score >= successThreshold) {
      playSound('victory');
      
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const interval = setInterval(function() {
        if (Date.now() > animationEnd) {
          return clearInterval(interval);
        }
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [score, successThreshold]);
  
  return (
    <div className="result-screen">
      <h2 className="result-title">Great Job!</h2>
      <p>You got <span className="score">{score}</span> out of {totalRounds} correct!</p>
      
      {maxDifficultyReached && (
        <p className="max-difficulty-message">
          Amazing! You reached the highest level: {difficultyName}!
        </p>
      )}
      
      {!maxDifficultyReached && (
        <p className="difficulty-message">
          You reached the {difficultyName} level. Keep practicing to reach higher levels!
        </p>
      )}
      
      <button className="play-again-button" onClick={onPlayAgain}>
        Play Again
      </button>
    </div>
  );
}

export default ResultScreen;
