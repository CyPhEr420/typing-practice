import { useRef, useEffect, useState } from 'react';
import './App.css';

function App() {

  const text = `
  Chapter 1
 
  It was a bright`

  const rawLines = text.trim().split('\n');
  const lines = rawLines.map(str => {
    const trimmedStr = str.trim();
    return trimmedStr === "" ? str : trimmedStr;
  });


  const spansRef = useRef(Array(lines.length).fill().map(() => [])); 

  const [startTime, setStartTime] = useState(0);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [errors, setErrors] = useState(0)
  const [wpm, setWPM] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [started, setStarted] = useState(false);

  const originalLetters = text.split('');



  useEffect(() => {
    if (spansRef.current[0][0]) {
      spansRef.current[0][0].focus();
    }

  }, []);

  useEffect(() => {

    const newAccuracy = Math.floor((originalLetters.length - errors) / originalLetters.length * 100);
    setAccuracy(newAccuracy);
  }, [errors, originalLetters.length]);




  const handleChange = (lineIndex, spanIndex, e) => {
    if (lineIndex === 0 && spanIndex === 0 && started === false) {
      setStartTime(Date.now())
      setStarted(true);
    }
    const line = lines[lineIndex];

    const writtenLetter = e.nativeEvent.data;
    const originalLetter = line[spanIndex];

    if (originalLetter === ' ') {
      setWordsTyped(prev => prev + 1)
    }



    if (lineIndex + 1 >= spansRef.current.length && spanIndex + 1 >= spansRef.current[spansRef.current.length - 1].length) {
      spansRef.current[lineIndex][spanIndex].blur();
      const elapsedTime = (Date.now() - startTime) / 1000 / 60;
      const currentWPM = Math.round(wordsTyped / elapsedTime);
      setWPM(currentWPM);
      setStarted(false)
    }



    if (writtenLetter === originalLetter) {
      e.target.innerText = originalLetter;
      e.target.classList.add('right');
      e.target.classList.remove('wrong');

    } else if (originalLetter === " " && writtenLetter === null) {
      e.target.innerText = originalLetter;
    }
    else {
      e.target.innerText = writtenLetter;
      e.target.classList.add('wrong');
      setErrors(prev => prev + 1);
    }

    if (spanIndex < line.length - 1) {
      spansRef.current[lineIndex][spanIndex + 1]?.focus();
    } else if (lineIndex < lines.length - 1) {
      spansRef.current[lineIndex + 1][0]?.focus();
    }

  };




  // const cheat = () => {
  //   setCheating(true); // Start cheating
  //   const startTime = Date.now();
  //   let wordsTyped = 0;

  //   const delay = 10; // Delay between each letter in milliseconds
  //   spansRef.current.forEach((span, index) => {
  //     setTimeout(() => {
  //       if (span) {
  //         span.innerText = originalLetters[index];
  //         span.classList.add('right');
  //         if (originalLetters[index] === ' ') {
  //           wordsTyped += 1;
  //         }
  //       }
  //       if (index === spansRef.current.length - 2) { 
  //         calculateWpm(startTime, wordsTyped + 1);
  //       }
  //     }, delay * index);
  //   });

  // };

  const handleBackspace = (lineIndex, spanIndex, e) => {
    if (e.key === 'Backspace') {
      if (spanIndex > 0) {
        const previousSpan = spansRef.current[lineIndex][spanIndex - 1];
        const originalLetter = lines[lineIndex][spanIndex - 1];

        if (errors > 0 && previousSpan.classList.contains('wrong')) {
          setErrors(prev => prev - 1);
        }

        previousSpan.classList.remove('right');
        previousSpan.classList.remove('wrong');
        previousSpan.innerText = originalLetter;

        previousSpan.focus();
      } else if (lineIndex > 0) {
       
        const previousLineIndex = lineIndex - 1;
        const lastSpanIndex = spansRef.current[previousLineIndex].length - 1;

      
        spansRef.current[previousLineIndex][lastSpanIndex]?.focus();
      }
    }
  };


  return (
    <>
      <div className="typing-container">
        <h1>WPM:{wpm}</h1>
        <h2>Accuracy:{accuracy}%</h2>
        {
          lines.map((line, lineIndex) => (
            <div key={lineIndex}>
              {line.split('').map((letter, spanIndex) => {
                return (
                  <>
                    <span
                      key={spanIndex}
                      ref={(el) => (
                        spansRef.current[lineIndex][spanIndex] = el

                      )}
                      contentEditable={true}
                      onInput={(e) => handleChange(lineIndex, spanIndex, e)}
                      onKeyDown={(e) => handleBackspace(lineIndex, spanIndex, e)}
                      spellCheck="false"
                      suppressContentEditableWarning={true}
                    >
                      {letter}
                    </span>

                    {line[0] === ' ' ? <br></br> : null}
                  </>

                )
              }

              )}
            </div>
          ))}
      </div>
      
    </>
  );
}

export default App;
