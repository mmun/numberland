// Sound library for the math game

// Cache for sounds
const soundCache = {};

// Sound URLs
const SOUNDS = {
  correct: "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3",
  incorrect:
    "https://assets.mixkit.co/active_storage/sfx/2053/2053-preview.mp3",
  victory: "https://assets.mixkit.co/active_storage/sfx/1993/1993-preview.mp3",
};

// Preload all sounds
export function preloadSounds() {
  Object.entries(SOUNDS).forEach(([name, url]) => {
    const audio = new Audio();
    audio.src = url;
    soundCache[name] = audio;
  });
}

// Play a sound by name
export function playSound(name) {
  if (!soundCache[name]) {
    // If not preloaded, create and play
    const audio = new Audio(SOUNDS[name]);
    audio.play().catch((e) => console.log("Error playing sound:", e));
    return;
  }

  // Clone the audio to allow multiple plays
  const sound = soundCache[name].cloneNode();
  sound.play().catch((e) => console.log("Error playing sound:", e));
}

// Initialize sounds
preloadSounds();
