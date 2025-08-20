import React, { useState, useEffect, useRef } from 'react';
import Metrics from './components/Metrics';
import TypingTest from './components/TypingTest';
import ResetButton from './components/ResetButton';
import Options from './components/Options';
import { texts } from './texts';
import './App.css';

function App() {
  const [textType, setTextType] = useState('story');
  const [duration, setDuration] = useState(1); // in minutes
  const [text, setText] = useState(texts[textType]);
  const [userInput, setUserInput] = useState('');
  const [errors, setErrors] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerIdRef = useRef(null);
  const [wpm, setWPM] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  useEffect(() => {
    setText(texts[textType]);
    resetTest();
  }, [textType]);

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

      if (userInput.length > 0) {
        const newAccuracy = Math.floor(
          ((userInput.length - currentErrors) / userInput.length) * 100
        );
        setAccuracy(newAccuracy);
      } else {
        setAccuracy(100);
      }
    }
  }, [userInput, text, started, finished]);

  useEffect(() => {
    if (started && !finished && timer > 0) {
      const minutes = timer / 60;
      if (minutes > 0) {
        const wordsTyped = userInput.length / 5;
        const currentWPM = Math.round(wordsTyped / minutes);
        setWPM(currentWPM);
      } else {
        setWPM(0);
      }
    }
  }, [timer, started, finished, userInput]);

  useEffect(() => {
    if (started && !finished && timer >= duration * 60) {
      handleFinish();
    }
  }, [timer, started, finished, duration]);

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
    <div className="app-container">
      <Options
        textType={textType}
        onTextTypeChange={setTextType}
        duration={duration}
        onDurationChange={setDuration}
      />
      <div className="typing-container">
        <Metrics wpm={wpm} accuracy={accuracy} time={formatTime(timer)} />
        <TypingTest
          text={text}
          onType={handleTyping}
          onFinish={handleFinish}
        />
        <ResetButton onReset={resetTest} />
      </div>
    </div>
  );
}

export default App;
