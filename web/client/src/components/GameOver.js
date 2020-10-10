import React from 'react'

export default function GameOver({score}) {
    return (
        <div>
            Game Over! Your score is {score.toFixed(2)}
        </div>
    )
}
