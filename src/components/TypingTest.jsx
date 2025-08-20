import React, { useState, useEffect, useRef } from 'react';

const TypingTest = ({ text, onType, onFinish }) => {
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const { value } = e.target;
    setUserInput(value);
    onType(value);

    if (value.length === text.length) {
      onFinish();
    }
  };

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="typing-area" onClick={handleFocus}>
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleChange}
        className="hidden-input"
      />
      <div className="text-display">
        {text.split('').map((char, index) => {
          let charClass = '';
          if (userInput.length > index) {
            charClass = char === userInput[index] ? 'right' : 'wrong';
          } else if (userInput.length === index) {
            charClass = 'current';
          }
          return (
            <span key={index} className={charClass}>
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default TypingTest;
