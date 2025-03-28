import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playSound } from '../sounds';

function ResultScreen({ score, maxDifficultyReached, maxDifficultyName, onPlayAgain }) {
  useEffect(() => {
    // Celebrate if they did well
    if (score >= 7) {
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
      
      // Clean up interval when component unmounts
      return () => clearInterval(interval);
    }
  }, [score]);

  return (
    <div id="result-screen" className="result-screen">
      <h2 className="result-title">Great Job!</h2>
      <p>You got <span className="score">{score}</span> correct!</p>
      
      {maxDifficultyReached && (
        <p className="max-difficulty-message">
          Amazing! You reached the {maxDifficultyName} level!
        </p>
      )}
      
      <button 
        id="play-again-button" 
        className="play-again-button"
        onClick={onPlayAgain}
      >
        Play Again
      </button>
    </div>
  );
}

export default ResultScreen;
