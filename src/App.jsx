import { useState } from 'react'
import './App.css'
import GameMenu from './components/GameMenu'
import Hangman from './components/Hangman'
import TicTacToe from './components/TicTacToe'
import Pong from './components/Pong'

function App() {
  const [currentGame, setCurrentGame] = useState(null)

  const handleSelectGame = (gameId) => {
    setCurrentGame(gameId)
  }

  const handleBackToMenu = () => {
    setCurrentGame(null)
  }

  return (
    <div className="app">
      {!currentGame && <GameMenu onSelectGame={handleSelectGame} />}
      {currentGame === 'hangman' && <Hangman onBackToMenu={handleBackToMenu} />}
      {currentGame === 'tictactoe' && <TicTacToe onBackToMenu={handleBackToMenu} />}
      {currentGame === 'pong' && <Pong onBackToMenu={handleBackToMenu} />}
    </div>
  )
}

export default App
