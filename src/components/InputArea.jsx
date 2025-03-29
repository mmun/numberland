import React, { useEffect, useRef } from 'react';

const InputArea = ({ 
  value, 
  onChange, 
  placeholder = "Enter your answer...",
  onSubmit
}) => {
  const inputRef = useRef(null);

  // Handle submit when user presses enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      onSubmit && onSubmit();
    }
  };

  // Prevent zoom on double tap
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const preventZoom = (e) => {
      // Prevent default only for touch events (preserve accessibility)
      if (e.touches && e.touches.length > 0) {
        if (e.touches.length === 1) {
          // Single touch, allow normal behavior
          return;
        }
        // Multiple touches, prevent zoom
        e.preventDefault();
      }
    };

    input.addEventListener('touchstart', preventZoom, { passive: false });
    return () => {
      input.removeEventListener('touchstart', preventZoom);
    };
  }, []);

  return (
    <div className="keyboard-sticky-bottom w-full p-4">
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric" 
        pattern="[0-9]*"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-xl rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary"
        style={{ fontSize: '1.5rem' }}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />
    </div>
  );
};

export default InputArea;
