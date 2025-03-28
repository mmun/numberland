import React, { useState } from 'react';
import LevelSelect from './components/LevelSelect';
import GameContainer from './components/GameContainer';
import ResultScreen from './components/ResultScreen';
import { TOTAL_ROUNDS } from './constants';

function App() {
  const [gameState, setGameState] = useState({
    currentMax: 0,
    currentRound: 0,
    score: 0,
    gameStarted: false,
    gameEnded: false
  });

  const startGame = (maxNumber) => {
    setGameState({
      currentMax: maxNumber,
      currentRound: 0,
      score: 0,
      gameStarted: true,
      gameEnded: false
    });
  };

  const incrementScore = () => {
    setGameState(prevState => ({
      ...prevState,
      score: prevState.score + 1
    }));
  };

  const nextRound = () => {
    const nextRoundNumber = gameState.currentRound + 1;
    
    if (nextRoundNumber >= TOTAL_ROUNDS) {
      setGameState(prevState => ({
        ...prevState,
        gameEnded: true,
        gameStarted: false
      }));
    } else {
      setGameState(prevState => ({
        ...prevState,
        currentRound: nextRoundNumber
      }));
    }
  };

  const resetGame = () => {
    setGameState({
      currentMax: 0,
      currentRound: 0,
      score: 0,
      gameStarted: false,
      gameEnded: false
    });
  };

  return (
    <div className="container">
      <h1>Numberland</h1>
      
      {!gameState.gameStarted && !gameState.gameEnded && (
        <LevelSelect onLevelSelect={startGame} />
      )}
      
      {gameState.gameStarted && (
        <GameContainer 
          currentMax={gameState.currentMax}
          currentRound={gameState.currentRound}
          totalRounds={TOTAL_ROUNDS}
          onCorrectAnswer={incrementScore}
          onNextRound={nextRound}
        />
      )}
      
      {gameState.gameEnded && (
        <ResultScreen 
          score={gameState.score} 
          totalRounds={TOTAL_ROUNDS} 
          onPlayAgain={resetGame} 
        />
      )}
    </div>
  );
}

export default App;
