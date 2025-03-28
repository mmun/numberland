// Game configuration constants

// Difficulty settings for adaptive gameplay
export const DIFFICULTY_LEVELS = [
  {
    name: "Beginner",
    range: [1, 3],
    description: "Just a few numbers to start your journey!",
  },
  {
    name: "Starter",
    range: [1, 5],
    description: "Small numbers you can count on one hand!",
  },
  {
    name: "Growing",
    range: [1, 10],
    description: "Numbers you can count on both hands!",
  },
  {
    name: "Advancing",
    range: [5, 15],
    description: "Bigger numbers that make you think!",
  },
  {
    name: "Challenging",
    range: [10, 20],
    description: "Big numbers that need clever strategies!",
  },
  {
    name: "Master",
    range: [10, 30],
    description: "Super big numbers for math masters!",
  },
];

// Number of correct answers required to advance to next level
export const REQUIRED_CORRECT_TO_ADVANCE = 5;

// Feedback messages for various performance levels
export const FEEDBACK_MESSAGES = {
  correct: [
    "Great job! 🌟",
    "Awesome! 🎉",
    "You're a math wizard! ✨",
    "Perfect! 🏆",
    "Spot on! 👍",
  ],
  incorrect: [
    "Not quite, but don't give up! 🌈",
    "Let's try a different one! 🌱",
    "Learning takes practice! 🌞",
    "You'll get it next time! 🌟",
    "Keep trying! 💪",
  ],
};
