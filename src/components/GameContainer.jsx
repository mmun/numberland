import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../utils/sounds';
import { FEEDBACK_MESSAGES } from '../constants';
import confetti from 'canvas-confetti';

function GameContainer({ 
  difficultyRange, 
  difficultyName,
  difficultyDescription,
  onAnswerSubmit, 
  onNextRound 
}) {
  const [number1, setNumber1] = useState(1);
  const [number2, setNumber2] = useState(1);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [difficultyChanged, setDifficultyChanged] = useState(false);
  const [prevDifficultyName, setPrevDifficultyName] = useState(difficultyName);
  
  const inputRef = useRef(null);
  
  // Generate a new problem whenever the round changes or difficulty changes
  useEffect(() => {
    generateProblem();
    setIsAnswerChecked(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficultyRange]);
  
  // Detect difficulty changes to trigger animations
  useEffect(() => {
    if (prevDifficultyName !== difficultyName) {
      setDifficultyChanged(true);
      setPrevDifficultyName(difficultyName);
      
      // Reset animation flag after animation completes
      const timer = setTimeout(() => {
        setDifficultyChanged(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [difficultyName, prevDifficultyName]);
  
  // Focus on input when a new problem is generated
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [number1, number2]);
  
  const generateProblem = () => {
    const [min, max] = difficultyRange;
    const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    
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
    
    // Notify parent component of result
    onAnswerSubmit(correct);
    
    if (correct) {
      // Get a random positive feedback message
      const randomIndex = Math.floor(Math.random() * FEEDBACK_MESSAGES.correct.length);
      setFeedback(FEEDBACK_MESSAGES.correct[randomIndex]);
      playSound('correct');
      showConfetti();
    } else {
      // Get a random encouraging feedback message
      const randomIndex = Math.floor(Math.random() * FEEDBACK_MESSAGES.incorrect.length);
      setFeedback(`${FEEDBACK_MESSAGES.incorrect[randomIndex]} The answer is ${correctAnswer}`);
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
    // Fewer emojis for younger children - less overwhelming
    for (let i = 0; i < 3; i++) {
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
      <div className="difficulty-indicator">
        <div className="difficulty-level-container">
          <span>Level: </span>
          <span className={`difficulty-level ${difficultyChanged ? 
            (prevDifficultyName < difficultyName ? 'difficulty-up' : 'difficulty-down') 
            : ''}`}>
            {difficultyName}
          </span>
        </div>
        <p className="difficulty-description">{difficultyDescription}</p>
      </div>
      
      <div className="equation">
        <span className="equation-number">{number1}</span>
        <span>+</span>
        <span className="equation-number">{number2}</span>
        <span>=</span>
        <input
          ref={inputRef}
          className="answer-input"
          type="number"
          inputMode="numeric"
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
