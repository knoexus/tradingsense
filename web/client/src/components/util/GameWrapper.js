import React from 'react'

export default function GameWrapper(props) {
    return (
        <div className="game">
            {props.children}
        </div>
    )
}
