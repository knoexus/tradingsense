import React from 'react'
import '../../styles/arrowButton.scss'

export default function Arrow({side, clicked}) {
    return (
        <div onClick={clicked} className={`button-FastForward-${side}`}>
            <div className="arrow">
                <div className={`arrow-top arrow-top-${side}`}></div>
                <div className={`arrow-bottom arrow-bottom-${side}`}></div>
            </div>
        </div>
    )
}
