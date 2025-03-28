import React, { useState, useEffect } from 'react';
import GameContainer from './components/GameContainer';
import { DIFFICULTY_LEVELS } from './constants';

function App() {
  const [gameState, setGameState] = useState({
    score: 0,
    currentDifficultyIndex: 0,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0,
    gameStarted: true
  });

  // Start the game immediately when component mounts
  useEffect(() => {
    // No need to wait for level selection
  }, []);

  const handleAnswerSubmit = (isCorrect) => {
    // Update score if correct
    if (isCorrect) {
      setGameState(prev => ({
        ...prev,
        score: prev.score + 1,
        consecutiveCorrect: prev.consecutiveCorrect + 1,
        consecutiveIncorrect: 0
      }));

      // Increase difficulty after 2 consecutive correct answers
      if (gameState.consecutiveCorrect + 1 >= 2 && 
          gameState.currentDifficultyIndex < DIFFICULTY_LEVELS.length - 1) {
        setGameState(prev => ({
          ...prev,
          currentDifficultyIndex: prev.currentDifficultyIndex + 1,
          consecutiveCorrect: 0 // Reset counter after difficulty change
        }));
      }
    } else {
      setGameState(prev => ({
        ...prev,
        consecutiveIncorrect: prev.consecutiveIncorrect + 1,
        consecutiveCorrect: 0
      }));

      // Decrease difficulty after 2 consecutive incorrect answers
      if (gameState.consecutiveIncorrect + 1 >= 2 && gameState.currentDifficultyIndex > 0) {
        setGameState(prev => ({
          ...prev,
          currentDifficultyIndex: prev.currentDifficultyIndex - 1,
          consecutiveIncorrect: 0 // Reset counter after difficulty change
        }));
      }
    }
  };

  const nextRound = () => {
    // Simply trigger a new round without tracking the count
  };

  const currentDifficulty = DIFFICULTY_LEVELS[gameState.currentDifficultyIndex];

  return (
    <div className="container">
      <h1>Numberland</h1>
      
      <GameContainer 
        difficultyRange={currentDifficulty.range}
        difficultyName={currentDifficulty.name}
        difficultyDescription={currentDifficulty.description}
        onAnswerSubmit={handleAnswerSubmit}
        onNextRound={nextRound}
      />
    </div>
  );
}

export default App;
