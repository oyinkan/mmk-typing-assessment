import React, { useState, useEffect, useRef } from 'react'
import randomWords from 'random-words'

function App() {
  const [words, setWords] = useState([])
  const [timer, setTimer] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [currentInput, setCurrentInput] = useState('')
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [correctWords, setCorrectWords] = useState(0)
  const [incorrectWords, setIncorrectWords] = useState(0)
  const [status, setStatus] = useState(true)
  const inputRef = useRef(null)

  useEffect(() => {
    getWords()
  }, [])

  useEffect(() => {
    if (selectedTime) {
      inputRef.current.focus()
    }
  }, [selectedTime])

  const getWords = () => {
    const sentence = randomWords(150)
    setWords(sentence)
  }

  const startTimer = (time) => {
    setSelectedTime(time)
    setTimer(time)
    if (!status) {
      setWords(getWords())
      setCurrentWordIndex(0)
      setCorrectWords(0)
      setIncorrectWords(0)
    }
    if (status) {
      let countDown = setInterval(() => {
        setTimer(prevCount => {
          if (prevCount === 0) {
            clearInterval(countDown)
            setStatus(false)
            setCurrentInput('')
            return 0;
          } else {
            return prevCount - 1
          }
        })
      }, 1000)
    }
  }

  const handleKeyDown = ({keyCode}) => {
    if (keyCode === 32) {
      const wordToCompare = words[currentWordIndex]
      const isMatch = wordToCompare === currentInput.trim()
      setCurrentInput("")
      setCurrentWordIndex(currentWordIndex + 1)

      console.log({isMatch})

      if (isMatch) {
        setCorrectWords(correctWords + 1)
      } else {
        setIncorrectWords(incorrectWords + 1)
      }
    }
  }

  const grossWPM = correctWords + incorrectWords / Number(selectedTime)
  const netSpeed = correctWords - incorrectWords / Number(selectedTime)
  const accuracy = netSpeed / grossWPM

  return (
    <section>
      <h1>Click the timer to start or a custom time in minutes</h1>
      { status ?
        <>
          <div className="timer">
            <button onClick={() => startTimer(60)}>1m</button>
            <button onClick={() => startTimer(120)}>2m</button>
            <button onClick={() => startTimer(300)}>5m</button>
            <input type="text" />
          </div>
          <div>
            <p className="timer-text">{timer}</p>
          </div>
          <div>
            <input
              type="text"
              className="input-text"
              ref={inputRef}
              disabled={!selectedTime} 
              onKeyDown={handleKeyDown}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Start typing..."
            />
          </div>
          <div className="content">
            {words.map((word, i) => (
              <span key={i}>
                <span>
                  {word.split("").map((char, idx) => (
                    <span key={idx}>{char}</span>
                  )) }
                </span>
                <span> </span>
              </span>
            ))}
          </div>
        </>
        :
        <>
          <div className="result">
            {correctWords !== 0 ?
              <>
                <div><p>Score: {correctWords} / {correctWords + incorrectWords}</p></div>
                <div><p>Gross WPM: {parseFloat(grossWPM).toFixed(2)} WPM</p></div>
                <div><p>Net Speed: {parseFloat(netSpeed).toFixed(2)} WPM</p></div>
                <div><p>Typing Accuracy: {parseFloat(accuracy * 100).toFixed(2)}%  </p></div>
              </>
              : <p>Results: 0</p>
            }
          </div>
        </>
      }
    </section>
  );
}

export default App;
