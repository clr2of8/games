import './GameMenu.css';

function GameMenu({ onSelectGame }) {
  const games = [
    { 
      id: 'hangman', 
      name: 'Hangman', 
      description: 'Guess the word before running out of attempts!',
      icon: '🎯'
    },
    { 
      id: 'tictactoe', 
      name: 'Tic-Tac-Toe', 
      description: 'Get three in a row to win!',
      icon: '⭕'
    }
  ];

  return (
    <div className="menu-container">
      <h1 className="menu-title">🎮 Game Center</h1>
      <p className="menu-subtitle">Choose a game to play</p>
      
      <div className="games-grid">
        {games.map(game => (
          <div 
            key={game.id} 
            className="game-card"
            onClick={() => onSelectGame(game.id)}
          >
            <div className="game-icon">{game.icon}</div>
            <h2 className="game-name">{game.name}</h2>
            <p className="game-description">{game.description}</p>
            <button className="play-btn">Play Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameMenu;
