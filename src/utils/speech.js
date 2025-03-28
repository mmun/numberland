// Speech synthesis utility functions

let voiceCache = null;

// Function to get the best American English female voice
export function getBestVoice() {
  if (!window.speechSynthesis) return null;
  if (voiceCache) return voiceCache;

  const voices = window.speechSynthesis.getVoices();

  // First try to find a US English female voice
  let voice = voices.find(
    (voice) => voice.lang.includes("en-US") && voice.name.includes("Female")
  );

  // If not found, try to find any US English voice
  if (!voice) {
    voice = voices.find((voice) => voice.lang.includes("en-US"));
  }

  // If still not found, use the first English voice
  if (!voice) {
    voice = voices.find((voice) => voice.lang.includes("en"));
  }

  // Default to the first available voice if nothing else works
  if (!voice && voices.length > 0) {
    voice = voices[0];
  }

  voiceCache = voice;
  return voice;
}

// Function to speak text
export function speakText(text) {
  if (!window.speechSynthesis) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Create new utterance
  const utterance = new SpeechSynthesisUtterance(text);

  // Set voice (may be null if voices aren't loaded yet)
  utterance.voice = getBestVoice();

  // Set other properties
  utterance.pitch = 1;
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.volume = 1;

  // Speak the text
  window.speechSynthesis.speak(utterance);
}

// Initialize speech synthesis and load voices
export function initSpeech(callback) {
  if (!window.speechSynthesis) return;

  // Load voices if not already loaded
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      getBestVoice();
      if (callback) callback();
    };
  }
}
