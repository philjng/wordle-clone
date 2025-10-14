import './styles.css';
import { useEffect, useState } from 'react';

const API_URL = "/api/fe/wordle-words"
const WORD_LENGTH = 5;

function App() {
  const [isGameOver, setIsGameOver] = useState(false)
  const [solution, setSolution] = useState("hello");
  const [guesses, setGuesses] = useState(Array(6).fill(null))
  const [currentGuess, setCurrentGuess] = useState("");

  useEffect(() => {
    console.log(currentGuess, guesses, guesses[5], guesses[5] !== null)
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

    return () => window.removeEventListener("keydown", handleType);
  }, [currentGuess, isGameOver, solution, guesses])

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) {
          throw new Error("HTTP error: ", response.status)
        }        
      
        const words = await response.json();
        const randomWord = words[Math.floor(Math.random() * words.length)]

        // setSolution(randomWord.toLowerCase())
      } catch (error) {
        console.log("Error fetching word: ", error)
      }

    }

    fetchWord();
  }, [])

  return (
    <div className="board">
        Solution: {solution}
        {
          guesses.map((guess, i) => {
            const isCurrentGuess = i === guesses.findIndex(val => val === null)
            return (
              <Line 
                guess={isCurrentGuess ? currentGuess : guess ?? ""} 
                isFinal={!isCurrentGuess && guess !== null}
                solution={solution}/>
            )
          })
        }
    </div>
  );
}

const Line = ({ guess, isFinal, solution }) => {
  const tiles = []

  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i];
    let className = "tile"

    if (isFinal) {
      if (char === solution[i]) {
        className += " correct";
      } else if (solution.includes(char)) {
        className += " close";
      } else {
        className += " incorrect"
       }
    }

    tiles.push(<div key={i} className={className}>{char}</div>)
  }

  return (
    <div className='line'>
      {tiles}
    </div>)
}

export default App;
