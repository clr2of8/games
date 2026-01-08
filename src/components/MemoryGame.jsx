import { useState, useCallback } from 'react';
import './MemoryGame.css';

const cardSymbols = ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎸', '🎹'];

const createShuffledCards = () => {
  return [...cardSymbols, ...cardSymbols]
    .sort(() => Math.random() - 0.5)
    .map((symbol, index) => ({ id: index, symbol }));
};

const MemoryGame = ({ onBackToMenu }) => {
  const [cards, setCards] = useState(createShuffledCards);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [checking, setChecking] = useState(false);

  const initializeGame = useCallback(() => {
    setCards(createShuffledCards());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
    setChecking(false);
  }, []);

  const handleCardClick = (index) => {
    if (checking || flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return;
    }
    
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    
    if (newFlipped.length === 2) {
      setChecking(true);
      setMoves(prev => prev + 1);
      
      const [first, second] = newFlipped;
      const isMatch = cards[first].symbol === cards[second].symbol;
      
      setTimeout(() => {
        if (isMatch) {
          const newMatched = [...matched, first, second];
          setMatched(newMatched);
          if (newMatched.length === cards.length) {
            setGameWon(true);
          }
        }
        setFlipped([]);
        setChecking(false);
      }, isMatch ? 500 : 1000);
    }
  };

  const isCardFlipped = (index) => flipped.includes(index) || matched.includes(index);

  return (
    <div className="memory-game">
      <div className="game-header">
        <h1>Memory Match Game</h1>
        <div className="game-info">
          <span>Moves: {moves}</span>
          <button onClick={initializeGame} className="reset-btn">New Game</button>
          <button onClick={onBackToMenu} className="reset-btn back-btn">Back to Menu</button>
        </div>
      </div>
      
      {gameWon && (
        <div className="win-message">
          🎉 You Won! Completed in {moves} moves! 🎉
        </div>
      )}

      <div className="cards-grid">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card ${isCardFlipped(index) ? 'flipped' : ''} ${matched.includes(index) ? 'matched' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{card.symbol}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
