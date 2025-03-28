import React from 'react';

function ProgressBar({ current, total }) {
  const progressPercentage = (current / total) * 100;
  
  return (
    <div className="progress-container">
      <div className="progress-text">
        Problem {current + 1} of {total}
      </div>
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
