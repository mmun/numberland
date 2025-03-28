import React from 'react';

function LevelSelect({ onLevelSelect }) {
  const levels = [
    { max: 3, name: "Level 1: Numbers 1-3" },
    { max: 5, name: "Level 2: Numbers 1-5" },
    { max: 9, name: "Level 3: Numbers 1-9" },
    { max: 15, name: "Level 4: Numbers 1-15" },
    { max: 19, name: "Level 5: Numbers 1-19" }
  ];

  return (
    <div className="level-selection">
      <h2>Choose a level:</h2>
      {levels.map((level, index) => (
        <button 
          key={index}
          className="level-button" 
          onClick={() => onLevelSelect(level.max)}
        >
          {level.name}
        </button>
      ))}
    </div>
  );
}

export default LevelSelect;
