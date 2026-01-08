import { useState, useEffect, useCallback, useRef } from 'react';
import './Snake.css';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

function Snake({ onBackToMenu }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const directionRef = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood({ x: 15, y: 15 });
    directionRef.current = INITIAL_DIRECTION;
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setGameStarted(true);
  };

  const handleKeyPress = useCallback((e) => {
    if (!gameStarted && e.key === ' ') {
      e.preventDefault();
      resetGame();
      return;
    }

    if (gameOver) return;

    if (e.key === ' ') {
      e.preventDefault();
      setIsPaused(prev => !prev);
      return;
    }

    const newDirection = { ...directionRef.current };

    switch (e.key) {
      case 'ArrowUp':
        if (directionRef.current.y === 0) {
          newDirection.x = 0;
          newDirection.y = -1;
        }
        break;
      case 'ArrowDown':
        if (directionRef.current.y === 0) {
          newDirection.x = 0;
          newDirection.y = 1;
        }
        break;
      case 'ArrowLeft':
        if (directionRef.current.x === 0) {
          newDirection.x = -1;
          newDirection.y = 0;
        }
        break;
      case 'ArrowRight':
        if (directionRef.current.x === 0) {
          newDirection.x = 1;
          newDirection.y = 0;
        }
        break;
      default:
        return;
    }

    e.preventDefault();
    directionRef.current = newDirection;
  }, [gameOver, gameStarted]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    const gameLoop = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y
        };

        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(prev => prev + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, GAME_SPEED);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, isPaused, food, generateFood]);

  return (
    <div className="snake-container">
      <div className="snake-header">
        <button className="back-btn" onClick={onBackToMenu}>← Back to Menu</button>
        <h1>🐍 Snake Game</h1>
        <div className="score">Score: {score}</div>
      </div>

      {!gameStarted && (
        <div className="start-screen">
          <h2>Welcome to Snake!</h2>
          <p>Use arrow keys to navigate</p>
          <p>Collect food to grow and score points</p>
          <button className="start-btn" onClick={resetGame}>Start Game</button>
          <p className="hint">Or press SPACE to start</p>
        </div>
      )}

      {gameStarted && (
        <>
          <div className="game-info">
            <span>Length: {snake.length}</span>
            <span>{isPaused ? '⏸ PAUSED' : '▶ Playing'}</span>
            <span>Press SPACE to pause</span>
          </div>

          <div className="game-board" style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE
          }}>
            {snake.map((segment, index) => (
              <div
                key={index}
                className={`snake-segment ${index === 0 ? 'snake-head' : ''}`}
                style={{
                  left: segment.x * CELL_SIZE,
                  top: segment.y * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE
                }}
              />
            ))}
            <div
              className="food"
              style={{
                left: food.x * CELL_SIZE,
                top: food.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE
              }}
            />
          </div>

          {gameOver && (
            <div className="game-over">
              <h2>Game Over!</h2>
              <p>Final Score: {score}</p>
              <p>Snake Length: {snake.length}</p>
              <button className="restart-btn" onClick={resetGame}>Play Again</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Snake;
