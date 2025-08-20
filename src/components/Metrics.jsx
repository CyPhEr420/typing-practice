import React from 'react';

const Metrics = ({ wpm, accuracy, time }) => {
  return (
    <div className="top-info">
      <h1>WPM: {wpm}</h1>
      <h2>Accuracy: {accuracy}%</h2>
      <h2>Time: {time}</h2>
    </div>
  );
};

export default Metrics;
