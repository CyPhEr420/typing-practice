import { useRef, useEffect, useState } from "react";
import "./App.css";

function App() {
  const text = `

  Chapter 1 
 
  It was a bright cold day in April, and the clocks were striking thirteen. 
  Winston Smith, his chin nuzzled into his breast in an effort to escape the 
  vile wind, slipped quickly through the glass doors of Victory Mansions, 
  though not quickly enough to prevent a swirl of gritty dust from entering 
  along with him. 
   
  The hallway smelt of boiled cabbage and old rag mats. At one end of it a 
  coloured poster, too large for indoor display, had been tacked to the wall. 
  It depicted simply an enormous face, more than a metre wide: the face of a 
  man of about forty-five, with a heavy black moustache and ruggedly handsome 
  features. Winston made for the stairs. It was no use trying the lift. Even 
  at the best of times it was seldom working, and at present the electric 
  current was cut off during daylight hours. It was part of the economy drive 
  in preparation for Hate Week. The flat was seven flights up, and Winston, 
  who was thirty-nine and had a varicose ulcer above his right ankle, went 
  slowly, resting several times on the way. On each landing, opposite the 
  lift-shaft, the poster with the enormous face gazed from the wall. It was 
  one of those pictures which are so contrived that the eyes follow you about 
  when you move. BIG BROTHER IS WATCHING YOU, the caption beneath it ran. `;

  const rawLines = text.trim().split("\n");
  const lines = rawLines.map((str) => {
    const trimmedStr = str.trim();
    let regex = /[a-zA-Z0-9]/;
    if (!regex.test(str)) {
      // str = str.replace(/\s+/g, " ").trim();
      str = " ";
    }
    // console.log(str, regex.test(str));
    return trimmedStr === "" ? str : trimmedStr;
  });

  // console.log(lines);
  const spansRef = useRef(
    Array(lines.length)
      .fill()
      .map(() => [])
  );

  const [startTime, setStartTime] = useState(0);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [errors, setErrors] = useState(0);
  const [wpm, setWPM] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [started, setStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerIdRef = useRef(null);

  const originalLetters = text.split("");

  useEffect(() => {
    if (spansRef.current[0][0]) {
      spansRef.current[0][0].focus();
    }
  }, []);

  useEffect(() => {
    const newAccuracy = Math.floor(
      ((originalLetters.length - errors) / originalLetters.length) * 100
    );
    setAccuracy(newAccuracy);
  }, [errors, originalLetters.length]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  const startClock = () => {
    timerIdRef.current = setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000);
  };

  const stopClock = () => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null; // Reset the timerIdRef to avoid multiple intervals
    }
  };

  const resetText = () => {
    spansRef.current.forEach((lineSpans, lineIndex) => {
      lineSpans.forEach((span, spanIndex) => {
        if (span) {
          const originalLetter = lines[lineIndex][spanIndex];
          span.innerText = originalLetter;
          span.classList.remove("right", "wrong");
        }
      });
    });
    if (spansRef.current[0][0]) {
      spansRef.current[0][0].focus();
    }
    setStartTime(0);
    setWPM(0);
    setErrors(0);
    setAccuracy(0);
    setTimer(0);
    setWordsTyped(0);
  };

  const handleChange = (lineIndex, spanIndex, e) => {
    if (lineIndex === 0 && spanIndex === 0 && started === false) {
      setStartTime(Date.now());
      setStarted(true);
      startClock();
    }
    const line = lines[lineIndex];

    const writtenLetter = e.nativeEvent.data;
    const originalLetter = line[spanIndex];

    if (originalLetter === " ") {
      setWordsTyped((prev) => prev + 1);
    }

    if (
      lineIndex + 1 >= spansRef.current.length &&
      spanIndex + 1 >= spansRef.current[spansRef.current.length - 1].length
    ) {
      spansRef.current[lineIndex][spanIndex].blur();
      const elapsedTime = (Date.now() - startTime) / 1000 / 60;
      const currentWPM = Math.round(wordsTyped / elapsedTime);
      setWPM(currentWPM);
      setStarted(false);
      stopClock();
    }

    if (writtenLetter === originalLetter) {
      e.target.innerText = originalLetter;
      e.target.classList.add("right");
      e.target.classList.remove("wrong");
    } else if (originalLetter === " " && writtenLetter === null) {
      e.target.innerText = originalLetter;
    } else {
      if (writtenLetter == " ") {
        e.target.innerText = originalLetter;
      } else {
        e.target.innerText = writtenLetter;
      }
      e.target.classList.add("wrong");
      setErrors((prev) => prev + 1);
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
    if (e.key === "Backspace") {
      if (spanIndex > 0) {
        const previousSpan = spansRef.current[lineIndex][spanIndex - 1];
        const originalLetter = lines[lineIndex][spanIndex - 1];

        if (errors > 0 && previousSpan.classList.contains("wrong")) {
          setErrors((prev) => prev - 1);
        }

        previousSpan.classList.remove("right");
        previousSpan.classList.remove("wrong");
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
        <div className="top-info">
          <h1>WPM:{wpm}</h1>
          <h2>Accuracy:{accuracy}%</h2>
          <h2>Time:{formatTime(timer)}</h2>
          <button onClick={resetText}>Reset</button>
        </div>

        {lines.map((line, lineIndex) => (
          <div key={`line-new-${lineIndex}`}>
            {line.split("").map((letter, spanIndex) => {
              return (
                <span
                  key={`line-${lineIndex}-span-${spanIndex}`}
                  ref={(el) => (spansRef.current[lineIndex][spanIndex] = el)}
                  contentEditable={true}
                  onInput={(e) => handleChange(lineIndex, spanIndex, e)}
                  onKeyDown={(e) => handleBackspace(lineIndex, spanIndex, e)}
                  spellCheck="false"
                  suppressContentEditableWarning={true}
                >
                  {letter}
                </span>
              );
            })}
            {line[0] === " " ? <br></br> : null}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
