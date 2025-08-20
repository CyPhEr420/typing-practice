import React from 'react';

const Options = ({
  textType,
  onTextTypeChange,
  duration,
  onDurationChange,
}) => {
  const textOptions = ['story', 'code'];
  const durationOptions = [1, 2, 5, 10]; // in minutes

  return (
    <div className="options-container">
      <div className="option">
        <label htmlFor="text-type">Text Type:</label>
        <select
          id="text-type"
          value={textType}
          onChange={(e) => onTextTypeChange(e.target.value)}
        >
          {textOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="option">
        <label htmlFor="duration">Duration (minutes):</label>
        <select
          id="duration"
          value={duration}
          onChange={(e) => onDurationChange(Number(e.target.value))}
        >
          {durationOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Options;
