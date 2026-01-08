import { useState } from 'react';
import './Hangman.css';

const WORDS = [
  'REACT', 'JAVASCRIPT', 'PROGRAMMING', 'DEVELOPER', 'COMPUTER',
  'KEYBOARD', 'ALGORITHM', 'FUNCTION', 'VARIABLE', 'COMPONENT'
];

const MAX_WRONG_GUESSES = 6;

const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

function Hangman({ onBackToMenu }) {
  const [word, setWord] = useState(getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'

  const resetGame = () => {
    setWord(getRandomWord());
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus('playing');
  };

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || gameStatus !== 'playing') {
      return;
    }

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    if (!word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      if (newWrongGuesses >= MAX_WRONG_GUESSES) {
        setGameStatus('lost');
      }
    } else {
      // Check if word is complete
      const isComplete = word.split('').every(l => newGuessedLetters.includes(l));
      if (isComplete) {
        setGameStatus('won');
      }
    }
  };

  const displayWord = () => {
    return word.split('').map(letter => 
      guessedLetters.includes(letter) ? letter : '_'
    ).join(' ');
  };

  const renderAlphabet = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return alphabet.map(letter => (
      <button
        key={letter}
        onClick={() => handleGuess(letter)}
        disabled={guessedLetters.includes(letter) || gameStatus !== 'playing'}
        className={`letter-btn ${guessedLetters.includes(letter) ? 'used' : ''}`}
      >
        {letter}
      </button>
    ));
  };

  const renderHangman = () => {
    const parts = [
      <circle key="head" cx="140" cy="50" r="20" />,
      <line key="body" x1="140" y1="70" x2="140" y2="120" />,
      <line key="leftArm" x1="140" y1="80" x2="120" y2="100" />,
      <line key="rightArm" x1="140" y1="80" x2="160" y2="100" />,
      <line key="leftLeg" x1="140" y1="120" x2="120" y2="150" />,
      <line key="rightLeg" x1="140" y1="120" x2="160" y2="150" />
    ];

    return (
      <svg className="hangman-svg" viewBox="0 0 200 200">
        {/* Gallows */}
        <line x1="10" y1="190" x2="100" y2="190" stroke="black" strokeWidth="3" />
        <line x1="40" y1="190" x2="40" y2="10" stroke="black" strokeWidth="3" />
        <line x1="40" y1="10" x2="140" y2="10" stroke="black" strokeWidth="3" />
        <line x1="140" y1="10" x2="140" y2="30" stroke="black" strokeWidth="3" />
        
        {/* Body parts */}
        {parts.slice(0, wrongGuesses).map(part => 
          <g key={part.key} stroke="black" strokeWidth="3" fill="none">
            {part}
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="hangman-container">
      <h1>Hangman</h1>
      <button onClick={onBackToMenu} className="back-btn">Back to Menu</button>
      
      <div className="game-area">
        <div className="hangman-visual">
          {renderHangman()}
        </div>

        <div className="game-info">
          <div className="word-display">
            {displayWord()}
          </div>

          <div className="status">
            {gameStatus === 'won' && <div className="message win">🎉 You Won!</div>}
            {gameStatus === 'lost' && <div className="message lose">😢 Game Over! The word was: {word}</div>}
            {gameStatus === 'playing' && (
              <div className="message">Wrong guesses: {wrongGuesses}/{MAX_WRONG_GUESSES}</div>
            )}
          </div>

          {gameStatus !== 'playing' && (
            <button onClick={resetGame} className="reset-btn">Play Again</button>
          )}

          {gameStatus === 'playing' && (
            <div className="alphabet">
              {renderAlphabet()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Hangman;
