import { useState, useEffect, useRef } from 'react'
import './Pong.css'

function Pong({ onBackToMenu }) {
  const canvasRef = useRef(null)
  const [score, setScore] = useState({ player: 0, computer: 0 })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const gameStateRef = useRef({
    ball: { x: 400, y: 300, dx: 4, dy: 4, radius: 8 },
    playerPaddle: { x: 20, y: 250, width: 10, height: 100 },
    computerPaddle: { x: 770, y: 250, width: 10, height: 100 },
    keys: {}
  })

  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 600
  const PADDLE_SPEED = 6
  const WINNING_SCORE = 5

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const game = gameStateRef.current

    const resetBall = (toLeft = false) => {
      game.ball.x = CANVAS_WIDTH / 2
      game.ball.y = CANVAS_HEIGHT / 2
      game.ball.dx = (toLeft ? -4 : 4) * (Math.random() * 0.5 + 0.75)
      game.ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.5 + 0.5)
    }

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
      }
      game.keys[e.key] = true
      
      if (e.key === ' ' && !gameStarted && !gameOver) {
        setGameStarted(true)
      }
    }

    const handleKeyUp = (e) => {
      game.keys[e.key] = false
    }

    const update = () => {
      if (!gameStarted || gameOver) return

      // Move player paddle
      if (game.keys['ArrowUp'] && game.playerPaddle.y > 0) {
        game.playerPaddle.y -= PADDLE_SPEED
      }
      if (game.keys['ArrowDown'] && game.playerPaddle.y < CANVAS_HEIGHT - game.playerPaddle.height) {
        game.playerPaddle.y += PADDLE_SPEED
      }

      // Move computer paddle (AI)
      const computerCenter = game.computerPaddle.y + game.computerPaddle.height / 2
      const ballY = game.ball.y
      const difficulty = 0.1

      if (computerCenter < ballY - 35) {
        game.computerPaddle.y += PADDLE_SPEED * difficulty * 10
      } else if (computerCenter > ballY + 35) {
        game.computerPaddle.y -= PADDLE_SPEED * difficulty * 10
      }

      game.computerPaddle.y = Math.max(0, Math.min(CANVAS_HEIGHT - game.computerPaddle.height, game.computerPaddle.y))

      // Move ball
      game.ball.x += game.ball.dx
      game.ball.y += game.ball.dy

      // Ball collision with top/bottom
      if (game.ball.y - game.ball.radius <= 0 || game.ball.y + game.ball.radius >= CANVAS_HEIGHT) {
        game.ball.dy *= -1
      }

      // Ball collision with paddles
      if (
        game.ball.x - game.ball.radius <= game.playerPaddle.x + game.playerPaddle.width &&
        game.ball.y >= game.playerPaddle.y &&
        game.ball.y <= game.playerPaddle.y + game.playerPaddle.height &&
        game.ball.dx < 0
      ) {
        game.ball.dx *= -1.05
        const hitPos = (game.ball.y - game.playerPaddle.y) / game.playerPaddle.height
        game.ball.dy = (hitPos - 0.5) * 8
      }

      if (
        game.ball.x + game.ball.radius >= game.computerPaddle.x &&
        game.ball.y >= game.computerPaddle.y &&
        game.ball.y <= game.computerPaddle.y + game.computerPaddle.height &&
        game.ball.dx > 0
      ) {
        game.ball.dx *= -1.05
        const hitPos = (game.ball.y - game.computerPaddle.y) / game.computerPaddle.height
        game.ball.dy = (hitPos - 0.5) * 8
      }

      // Score when ball goes out
      if (game.ball.x < 0) {
        setScore(prev => {
          const newScore = { ...prev, computer: prev.computer + 1 }
          if (newScore.computer >= WINNING_SCORE) {
            setGameOver(true)
          }
          return newScore
        })
        resetBall(false)
      } else if (game.ball.x > CANVAS_WIDTH) {
        setScore(prev => {
          const newScore = { ...prev, player: prev.player + 1 }
          if (newScore.player >= WINNING_SCORE) {
            setGameOver(true)
          }
          return newScore
        })
        resetBall(true)
      }
    }

    const draw = () => {
      // Clear canvas
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Draw center line
      ctx.strokeStyle = '#fff'
      ctx.setLineDash([10, 10])
      ctx.beginPath()
      ctx.moveTo(CANVAS_WIDTH / 2, 0)
      ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw paddles
      ctx.fillStyle = '#fff'
      ctx.fillRect(game.playerPaddle.x, game.playerPaddle.y, game.playerPaddle.width, game.playerPaddle.height)
      ctx.fillRect(game.computerPaddle.x, game.computerPaddle.y, game.computerPaddle.width, game.computerPaddle.height)

      // Draw ball
      ctx.beginPath()
      ctx.arc(game.ball.x, game.ball.y, game.ball.radius, 0, Math.PI * 2)
      ctx.fill()

      // Draw scores
      ctx.font = '48px monospace'
      ctx.fillText(score.player, CANVAS_WIDTH / 4, 60)
      ctx.fillText(score.computer, 3 * CANVAS_WIDTH / 4, 60)

      if (!gameStarted && !gameOver) {
        ctx.font = '24px monospace'
        ctx.fillText('Press SPACE to start', CANVAS_WIDTH / 2 - 150, CANVAS_HEIGHT / 2 + 50)
      }
    }

    const gameLoop = () => {
      update()
      draw()
      requestAnimationFrame(gameLoop)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    gameLoop()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameStarted, gameOver, score])

  const handleRestart = () => {
    setScore({ player: 0, computer: 0 })
    setGameStarted(false)
    setGameOver(false)
    const game = gameStateRef.current
    game.ball.x = CANVAS_WIDTH / 2
    game.ball.y = CANVAS_HEIGHT / 2
    game.ball.dx = 4
    game.ball.dy = 4
    game.playerPaddle.y = 250
    game.computerPaddle.y = 250
  }

  return (
    <div className="pong-container">
      <div className="pong-header">
        <button onClick={onBackToMenu} className="back-button">← Back to Menu</button>
        <h1>PONG</h1>
        <button onClick={handleRestart} className="restart-button">Restart</button>
      </div>
      
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="pong-canvas"
      />
      
      <div className="pong-controls">
        <p>Use <kbd>↑</kbd> and <kbd>↓</kbd> arrow keys to control your paddle</p>
        <p>First to {WINNING_SCORE} points wins!</p>
      </div>

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-message">
            <h2>{score.player >= WINNING_SCORE ? 'You Win!' : 'Computer Wins!'}</h2>
            <p>Final Score: {score.player} - {score.computer}</p>
            <button onClick={handleRestart} className="play-again-button">Play Again</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pong
