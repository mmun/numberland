import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { playSound } from '../sounds';
import {
  DIFFICULTY_LEVELS,
  FEEDBACK_MESSAGES,
  REQUIRED_CORRECT_TO_ADVANCE,
} from '../constants';

function Game({ onGameEnd }) {
  // Game state
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState(0);
  const [currentDifficultyIndex, setCurrentDifficultyIndex] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveIncorrect, setConsecutiveIncorrect] = useState(0);
  const [number1, setNumber1] = useState(1);
  const [number2, setNumber2] = useState(1);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showNextButton, setShowNextButton] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [difficultyAnimation, setDifficultyAnimation] = useState('');
  const [speechEnabled, setSpeechEnabled] = useState(false);
  
  const answerInputRef = useRef(null);
  const equationContainerRef = useRef(null);
  const speechSynth = window.speechSynthesis;
  const [voiceCache, setVoiceCache] = useState(null);

  // Generate a new problem based on current difficulty
  const generateProblem = () => {
    const currentDifficulty = DIFFICULTY_LEVELS[currentDifficultyIndex];
    const [min, max] = currentDifficulty.range;

    const newNumber1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const newNumber2 = Math.floor(Math.random() * (max - min + 1)) + min;
    const answer = newNumber1 + newNumber2;

    setNumber1(newNumber1);
    setNumber2(newNumber2);
    setCurrentAnswer(answer);
    setUserAnswer('');
    setFeedback('');
    setShowNextButton(false);
    setInputDisabled(false);

    // Focus the input after generating a new problem
    if (answerInputRef.current) {
      answerInputRef.current.focus();
    }

    // Speak the equation if speech is enabled
    if (speechEnabled) {
      speakEquation(newNumber1, newNumber2);
    }
  };

  // Initialize game
  useEffect(() => {
    generateProblem();
    
    // Initialize speech synthesis
    if (speechSynth.onvoiceschanged !== undefined) {
      speechSynth.onvoiceschanged = getBestVoice;
    }
  }, []);

  // Get the best voice for speech synthesis
  const getBestVoice = () => {
    if (voiceCache) return voiceCache;

    const voices = speechSynth.getVoices();

    // First try to find a US English female voice
    let voice = voices.find(
      (v) => v.lang.includes("en-US") && v.name.includes("Female")
    );

    // If not found, try to find any US English voice
    if (!voice) {
      voice = voices.find((v) => v.lang.includes("en-US"));
    }

    // If still not found, use the first English voice
    if (!voice) {
      voice = voices.find((v) => v.lang.includes("en"));
    }

    // Default to the first available voice if nothing else works
    if (!voice && voices.length > 0) {
      voice = voices[0];
    }

    setVoiceCache(voice);
    return voice;
  };

  // Function to speak text
  const speakText = (text) => {
    if (!speechEnabled) return;

    // Cancel any ongoing speech
    speechSynth.cancel();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Set voice
    utterance.voice = getBestVoice();

    // Set other properties
    utterance.pitch = 1;
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.volume = 1;

    // Speak the text
    speechSynth.speak(utterance);
  };

  // Function to speak the current equation
  const speakEquation = (num1, num2) => {
    const text = `${num1} plus ${num2} equals what?`;
    speakText(text);
  };

  // Toggle speech functionality
  const toggleSpeech = () => {
    const newSpeechEnabled = !speechEnabled;
    setSpeechEnabled(newSpeechEnabled);

    // If turning on, read current equation
    if (newSpeechEnabled) {
      speakEquation(number1, number2);
    } else {
      // If turning off, stop any ongoing speech
      speechSynth.cancel();
    }
  };

  // Check the user's answer
  const checkAnswer = () => {
    const parsedAnswer = parseInt(userAnswer);

    if (isNaN(parsedAnswer)) {
      setFeedback("Please enter a number!");
      return;
    }

    const isCorrect = parsedAnswer === currentAnswer;

    if (isCorrect) {
      setScore(score + 1);
      setConsecutiveCorrect(consecutiveCorrect + 1);
      setConsecutiveIncorrect(0);

      // Get a random positive feedback message
      const randomIndex = Math.floor(
        Math.random() * FEEDBACK_MESSAGES.correct.length
      );
      setFeedback(FEEDBACK_MESSAGES.correct[randomIndex]);

      // Disable the input field after a correct answer
      setInputDisabled(true);

      playSound("correct");
      showConfetti();

      // Increase difficulty after required number of consecutive correct answers
      if (
        consecutiveCorrect + 1 >= REQUIRED_CORRECT_TO_ADVANCE &&
        currentDifficultyIndex < DIFFICULTY_LEVELS.length - 1
      ) {
        setCurrentDifficultyIndex(currentDifficultyIndex + 1);
        setConsecutiveCorrect(0); // Reset counter
        setDifficultyAnimation("up"); // Show upgrade animation
      }
    } else {
      setConsecutiveIncorrect(consecutiveIncorrect + 1);
      setConsecutiveCorrect(0);

      // Get a random encouraging feedback message
      const randomIndex = Math.floor(
        Math.random() * FEEDBACK_MESSAGES.incorrect.length
      );
      setFeedback(`${FEEDBACK_MESSAGES.incorrect[randomIndex]} The answer is ${currentAnswer}`);

      playSound("incorrect");
      showPoopEmoji();

      // Add shake animation
      if (equationContainerRef.current) {
        equationContainerRef.current.classList.add("shake");
        setTimeout(() => {
          if (equationContainerRef.current) {
            equationContainerRef.current.classList.remove("shake");
          }
        }, 500);
      }

      // Decrease difficulty after 2 consecutive incorrect answers
      if (
        consecutiveIncorrect + 1 >= 2 &&
        currentDifficultyIndex > 0
      ) {
        setCurrentDifficultyIndex(currentDifficultyIndex - 1);
        setConsecutiveIncorrect(0); // Reset counter
        setDifficultyAnimation("down"); // Show downgrade animation
      }
    }

    // Show next button
    setShowNextButton(true);
  };

  // Move to the next round
  const nextRound = () => {
    const newRound = currentRound + 1;
    setCurrentRound(newRound);
    setDifficultyAnimation('');
    
    generateProblem();
  };

  // Show confetti animation for correct answers
  const showConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Show poop emoji animation for incorrect answers
  const showPoopEmoji = () => {
    // Create and append emojis to the body
    for (let i = 0; i < 3; i++) {
      const poop = document.createElement("div");
      poop.className = "emoji";
      poop.textContent = "💩";
      poop.style.left = `${Math.random() * 100}vw`;
      document.body.appendChild(poop);

      // Remove after animation completes
      setTimeout(() => {
        poop.remove();
      }, 2000);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
  };

  // Handle key press events
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (!showNextButton) {
        checkAnswer();
      } else {
        nextRound();
      }
    }
  };

  // Get current difficulty information
  const currentDifficulty = DIFFICULTY_LEVELS[currentDifficultyIndex];

  return (
    <div id="game-container" className="game-container">
      <div className="difficulty-indicator">
        <div className="difficulty-level-container">
          <span>Level: </span>
          <span 
            id="difficulty-level" 
            className={`difficulty-level ${difficultyAnimation ? `difficulty-${difficultyAnimation}` : ''}`}
          >
            {currentDifficulty.name}
          </span>
        </div>
        <p id="difficulty-description" className="difficulty-description">
          {currentDifficulty.description}
        </p>
      </div>
      
      <div className="speech-toggle-container">
        <button 
          id="speech-toggle" 
          className={`speech-toggle ${speechEnabled ? 'active' : ''}`}
          onClick={toggleSpeech}
          aria-pressed={speechEnabled}
        >
          {speechEnabled ? '🔊' : '🔇'} Text-to-Speech
        </button>
      </div>
      
      <div ref={equationContainerRef} className="equation-container">
        <div className="equation">
          <span className="equation-number">{number1}</span>
          <span>+</span>
          <span className="equation-number">{number2}</span>
          <span>=</span>
          <input
            ref={answerInputRef}
            id="answer-input"
            className="answer-input"
            type="number"
            min="0"
            max="99"
            value={userAnswer}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={inputDisabled}
          />
        </div>
      </div>
      
      {!showNextButton ? (
        <button id="check-button" className="check-button" onClick={checkAnswer}>
          Check Answer
        </button>
      ) : (
        <button id="next-button" className="next-button" onClick={nextRound}>
          Next Problem
        </button>
      )}
      
      {feedback && <div id="feedback" className="feedback">{feedback}</div>}
    </div>
  );
}

export default Game;
