// Simple sound player utility
export function playSound(soundName) {
  const sounds = {
    correct: "/sounds/correct.mp3",
    incorrect: "/sounds/incorrect.mp3",
    victory: "/sounds/victory.mp3",
  };

  if (sounds[soundName]) {
    const audio = new Audio(sounds[soundName]);
    audio.play().catch((e) => console.log("Sound play error:", e));
  }
}
