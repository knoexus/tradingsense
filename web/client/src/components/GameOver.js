import React from 'react'
import '../styles/gameOver.css'

export default function GameOver({score}) {
    return (
        <div className="gameOver">
            <h2>Game Over</h2>
            <h3>Your score is {score.toFixed(2)}$</h3>
            <div className="gameOver-furtherActions">
                Press
                    <button onClick={() => window.location.reload()} className="button-Continue">me</button> 
                    to play again or 
                    <button className="button-Exit">me</button> to exit.
            </div>
        </div>
    )
}
