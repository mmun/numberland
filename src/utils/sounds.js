// Sound effects mapping
const SOUNDS = {
  correct: new Audio("/sounds/correct.mp3"),
  incorrect: new Audio("/sounds/incorrect.mp3"),
  victory: new Audio("/sounds/victory.mp3"),
};

// Play a sound effect by name
export const playSound = (soundName) => {
  try {
    // If sound exists and is playable
    if (SOUNDS[soundName]) {
      // Reset to beginning if already playing
      SOUNDS[soundName].currentTime = 0;
      // Play the sound
      SOUNDS[soundName].play().catch((error) => {
        console.warn(`Error playing sound "${soundName}":`, error);
      });
    } else {
      console.warn(`Sound "${soundName}" not found`);
    }
  } catch (error) {
    console.error("Error in playSound:", error);
  }
};
