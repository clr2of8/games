import { useState } from 'react';
import './TicTacToe.css';

function TicTacToe({ onBackToMenu }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'draw'

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || gameStatus !== 'playing') {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const result = calculateWinner(newBoard);
    if (result) {
      setGameStatus('won');
    } else if (newBoard.every(square => square !== null)) {
      setGameStatus('draw');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus('playing');
  };

  const renderSquare = (index) => {
    const result = calculateWinner(board);
    const isWinningSquare = result && result.line.includes(index);
    
    return (
      <button
        className={`square ${isWinningSquare ? 'winning' : ''}`}
        onClick={() => handleClick(index)}
      >
        {board[index]}
      </button>
    );
  };

  const getStatusMessage = () => {
    const result = calculateWinner(board);
    if (result) {
      return `🎉 Player ${result.winner} Wins!`;
    } else if (gameStatus === 'draw') {
      return "🤝 It's a Draw!";
    } else {
      return `Next player: ${isXNext ? 'X' : 'O'}`;
    }
  };

  return (
    <div className="tictactoe-container">
      <h1>Tic-Tac-Toe</h1>
      <button onClick={onBackToMenu} className="back-btn">Back to Menu</button>
      
      <div className="game-content">
        <div className="status-message">{getStatusMessage()}</div>
        
        <div className="board">
          <div className="board-row">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </div>
          <div className="board-row">
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </div>
          <div className="board-row">
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </div>
        </div>

        {gameStatus !== 'playing' && (
          <button onClick={resetGame} className="reset-btn">Play Again</button>
        )}
      </div>
    </div>
  );
}

export default TicTacToe;
