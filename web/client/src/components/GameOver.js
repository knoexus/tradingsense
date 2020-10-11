import React from 'react'
import '../styles/gameOver.css'

export default function GameOver({score}) {
    return (
        <div className="gameOver">
            <h2>Game Over! Your score is {score.toFixed(2)}</h2>
        </div>
    )
}
