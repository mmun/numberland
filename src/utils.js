/**
 * Helper functions for DOM manipulation and UI effects
 */

export function showElement(id) {
  document.getElementById(id).classList.remove("hidden");
}

export function hideElement(id) {
  document.getElementById(id).classList.add("hidden");
}

export function toggleElements(hideId, showId) {
  hideElement(hideId);
  showElement(showId);
}

export function updateText(id, text) {
  document.getElementById(id).textContent = text;
}

export function clearInput(id) {
  document.getElementById(id).value = "";
}

export function focusElement(id) {
  document.getElementById(id).focus();
}
