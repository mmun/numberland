import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../utils/sounds';
import ProgressBar from './ProgressBar';
import confetti from 'canvas-confetti';

function GameContainer({ currentMax, currentRound, totalRounds, onCorrectAnswer, onNextRound }) {
  const [number1, setNumber1] = useState(1);
  const [number2, setNumber2] = useState(1);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  
  const inputRef = useRef(null);
  
  // Generate a new problem whenever the round changes
  useEffect(() => {
    generateProblem();
    setIsAnswerChecked(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound, currentMax]);
  
  // Focus on input when a new problem is generated
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [number1, number2]);
  
  const generateProblem = () => {
    const num1 = Math.floor(Math.random() * currentMax) + 1;
    const num2 = Math.floor(Math.random() * currentMax) + 1;
    
    setNumber1(num1);
    setNumber2(num2);
    setUserAnswer('');
    setFeedback('');
    setIsAnswerCorrect(null);
  };
  
  const checkAnswer = () => {
    const correctAnswer = number1 + number2;
    const parsedUserAnswer = parseInt(userAnswer, 10);
    
    if (isNaN(parsedUserAnswer)) {
      setFeedback('Please enter a number!');
      return;
    }
    
    const correct = parsedUserAnswer === correctAnswer;
    setIsAnswerCorrect(correct);
    setIsAnswerChecked(true);
    
    if (correct) {
      setFeedback('✅ Correct!');
      onCorrectAnswer();
      playSound('correct');
      showConfetti();
    } else {
      setFeedback(`❌ Oops! The answer is ${correctAnswer}`);
      playSound('incorrect');
      showPoopEmoji();
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (!isAnswerChecked) {
        checkAnswer();
      } else {
        onNextRound();
      }
    }
  };
  
  const showConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };
  
  const showPoopEmoji = () => {
    for (let i = 0; i < 5; i++) {
      const poop = document.createElement('div');
      poop.className = 'emoji poop-emoji';
      poop.textContent = '💩';
      poop.style.left = `${Math.random() * 100}vw`;
      document.body.appendChild(poop);

      // Remove after animation completes
      setTimeout(() => {
        poop.remove();
      }, 2000);
    }
  };
  
  return (
    <div className="game-container">
      <ProgressBar current={currentRound} total={totalRounds} />
      
      <div className="equation">
        <span className="equation-number">{number1}</span>
        <span>+</span>
        <span className="equation-number">{number2}</span>
        <span>=</span>
        <input
          ref={inputRef}
          className="answer-input"
          type="number"
          min="0"
          max="99"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isAnswerChecked}
        />
      </div>
      
      {!isAnswerChecked ? (
        <button className="check-button" onClick={checkAnswer}>
          Check Answer
        </button>
      ) : (
        <button className="next-button" onClick={onNextRound}>
          Next Problem
        </button>
      )}
      
      {feedback && <div className="feedback">{feedback}</div>}
    </div>
  );
}

export default GameContainer;
