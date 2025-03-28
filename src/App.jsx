import React, { useState, useEffect } from 'react';
import GameContainer from './components/GameContainer';
import ResultScreen from './components/ResultScreen';
import { DIFFICULTY_LEVELS } from './constants';
import { initSpeech } from './utils/speech';

function App() {
  const [gameState, setGameState] = useState({
    score: 0,
    rounds: 0,
    currentDifficultyIndex: 0,
    gameStarted: true,
    gameOver: false
  });

  // Initialize speech synthesis when component mounts
  useEffect(() => {
    initSpeech();
  }, []);

  const handleAnswerSubmit = (isCorrect) => {
    // Update score if correct
    if (isCorrect) {
      setGameState(prev => ({
        ...prev,
        score: prev.score + 1,
      }));
    }
  };

  const handleNextRound = () => {
    // Increment the round counter
    setGameState(prev => ({
      ...prev,
      rounds: prev.rounds + 1
    }));
  };

  const handleDifficultyChange = (change) => {
    setGameState(prev => {
      const newIndex = Math.max(0, Math.min(DIFFICULTY_LEVELS.length - 1, prev.currentDifficultyIndex + change));
      return {
        ...prev,
        currentDifficultyIndex: newIndex
      };
    });
  };

  const handleEndGame = () => {
    setGameState(prev => ({
      ...prev,
      gameOver: true
    }));
  };

  const handlePlayAgain = () => {
    setGameState({
      score: 0,
      rounds: 0,
      currentDifficultyIndex: 0,
      gameStarted: true,
      gameOver: false
    });
  };

  const currentDifficulty = DIFFICULTY_LEVELS[gameState.currentDifficultyIndex];
  const maxDifficultyReached = gameState.currentDifficultyIndex === DIFFICULTY_LEVELS.length - 1;

  return (
    <div className="container">
      <header>
        <h1>Numberland</h1>
      </header>
      
      {gameState.gameOver ? (
        <ResultScreen 
          score={gameState.score}
          rounds={gameState.rounds}
          maxDifficultyReached={maxDifficultyReached}
          difficultyName={currentDifficulty.name}
          onPlayAgain={handlePlayAgain}
        />
      ) : (
        <>
          <div className="game-info">
            <div className="score-display">Score: {gameState.score}</div>
            <div className="round-display">Round: {gameState.rounds + 1}</div>
            <button className="end-game-button" onClick={handleEndGame}>End Game</button>
          </div>
          
          <GameContainer 
            difficultyRange={currentDifficulty.range}
            difficultyName={currentDifficulty.name}
            difficultyDescription={currentDifficulty.description}
            currentDifficultyIndex={gameState.currentDifficultyIndex}
            onAnswerSubmit={handleAnswerSubmit}
            onNextRound={handleNextRound}
            onDifficultyChange={handleDifficultyChange}
          />
        </>
      )}
    </div>
  );
}

export default App;
