import React, { useState } from 'react';
import Game from './components/Game';
import ResultScreen from './components/ResultScreen';
import './style.css';

function App() {
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [maxDifficultyReached, setMaxDifficultyReached] = useState(false);
  const [maxDifficultyName, setMaxDifficultyName] = useState('');

  const handleGameEnd = (score, difficultyReached, difficultyName) => {
    setFinalScore(score);
    setMaxDifficultyReached(difficultyReached);
    setMaxDifficultyName(difficultyName);
    setShowResults(true);
  };

  const handlePlayAgain = () => {
    setShowResults(false);
  };

  return (
    <div className="container">
      <h1>Numberland</h1>
      
      {!showResults ? (
        <Game onGameEnd={handleGameEnd} />
      ) : (
        <ResultScreen 
          score={finalScore}
          maxDifficultyReached={maxDifficultyReached}
          maxDifficultyName={maxDifficultyName}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}

export default App;
