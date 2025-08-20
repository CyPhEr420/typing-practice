import React, { useState, useEffect, useRef } from 'react';
import Metrics from './components/Metrics';
import TypingTest from './components/TypingTest';
import ResetButton from './components/ResetButton';
import { text as newText } from './text';
import './App.css';

function App() {
  const [text, setText] = useState(newText);
  const [userInput, setUserInput] = useState('');
  const [errors, setErrors] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerIdRef = useRef(null);
  const [wpm, setWPM] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const startClock = () => {
    timerIdRef.current = setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000);
  };

  const stopClock = () => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
  };

  const handleTyping = (value) => {
    if (!started) {
      setStarted(true);
      startClock();
    }
    setUserInput(value);
  };

  const handleFinish = () => {
    setFinished(true);
    stopClock();
  };

  const resetTest = () => {
    stopClock();
    setStarted(false);
    setFinished(false);
    setUserInput('');
    setErrors(0);
    setTimer(0);
    setWPM(0);
    setAccuracy(100);
  };

  useEffect(() => {
    if (started && !finished) {
      const currentErrors = userInput.split('').reduce((acc, char, index) => {
        return char === text[index] ? acc : acc + 1;
      }, 0);
      setErrors(currentErrors);

      const newAccuracy = Math.floor(
        ((userInput.length - currentErrors) / userInput.length) * 100
      );
      setAccuracy(newAccuracy > 0 ? newAccuracy : 100);
    }
  }, [userInput, text, started, finished]);

  useEffect(() => {
    if (started && !finished && timer > 0) {
      const wordsTyped = userInput.length / 5;
      const minutes = timer / 60;
      const currentWPM = Math.round(wordsTyped / minutes);
      setWPM(currentWPM > 0 ? currentWPM : 0);
    }
  }, [timer, started, finished, userInput]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}:${String(secs).padStart(2, '0')}`;
  };


  return (
    <>
      <div className="typing-container">
        <Metrics wpm={wpm} accuracy={accuracy} time={formatTime(timer)} />
        <TypingTest
          text={text}
          onType={handleTyping}
          onFinish={handleFinish}
        />
        <ResetButton onReset={resetTest} />
      </div>
    </>
  );
}

export default App;
