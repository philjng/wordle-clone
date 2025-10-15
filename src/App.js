import { Line } from './components/Line';
import './styles.css';
import { useEffect, useState } from 'react';

const API_URL = "/api/fe/wordle-words"
const WORD_LENGTH = 5;

function App() {
  const [isGameOver, setIsGameOver] = useState(false)
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null))
  const [currentGuess, setCurrentGuess] = useState("");
  const [showSolution, setShowSolution] = useState(false)

  // handler for user input
  useEffect(() => {
    const handleType = (event) => {
      if (isGameOver) {
        return;
      }

      if (event.key === "Backspace") {
        setCurrentGuess(currentGuess => currentGuess.slice(0, -1))
        return;
      }

      if (event.key === "Enter") {
        if (currentGuess.length !== 5) {
          return;
        }

        const isCorrect = solution === currentGuess;
        if (isCorrect || guesses[4] !== null) {
          console.log("GAME OVER")
          setIsGameOver(true)
          setShowSolution(true)
        }

        const newGuesses = [...guesses]
        newGuesses[guesses.findIndex(val => val === null)] = currentGuess
        setGuesses(newGuesses)
        setCurrentGuess("")
      }

      // has to be separate to allow backspace and enter key
      if (currentGuess.length >= 5) {
        return;
      }

      const isLetter = event.key.match(/^[a-z]{1}$/) !== null;
      if (isLetter) {
        setCurrentGuess(oldGuess => oldGuess + event.key)
      }
    }

    window.addEventListener("keydown", handleType);

    return () => {
      window.removeEventListener("keydown", handleType);
    }
  }, [currentGuess, isGameOver, solution, guesses])

  // handler for fetching word from API
  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) {
          throw new Error("HTTP error: ", response.status)
        }        
      
        const words = await response.json();
        const randomWord = words[Math.floor(Math.random() * words.length)]

        setSolution(randomWord.toLowerCase())
      } catch (error) {
        console.log("Error fetching word: ", error)
      }

    }

    fetchWord();
  }, [])

  return (
    <div className="board">
        <h3>Solution: 
          <div className="solution" onClick={() => setShowSolution(!showSolution)}>{showSolution ? " "  + solution : " *****"}</div>
        </h3>
        {
          guesses.map((guess, i) => {
            const isCurrentGuess = i === guesses.findIndex(val => val === null)
            return (
              <Line 
                key={i}
                guess={isCurrentGuess ? currentGuess : guess ?? ""} 
                isFinal={!isCurrentGuess && guess !== null}
                solution={solution}
                wordLength={WORD_LENGTH}
                isCurrent={isCurrentGuess}
              />
            )
          })
        }
    </div>
  );
}

export default App;
