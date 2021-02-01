import React from 'react'
import { Link } from 'react-router-dom'

import '../styles/gameOver.css'

export default function GameOver({score}) {
    return (
        <div className="gameOver">
            <div>
                <h2>Game Over</h2>
                <h3>Your score is <b>{score.toFixed(2)}$</b></h3>
                <div className="gameOver-furtherActions">
                    Press
                        <button onClick={() => window.location.reload()} className="button-Continue">me</button> 
                        to play again or 
                        <Link to="/"><button className="button-Exit">me</button></Link> to exit.
                </div>
            </div>
        </div>
    )
}
