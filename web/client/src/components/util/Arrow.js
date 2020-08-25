import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import Zoom from '@material-ui/core/Zoom'
import '../../styles/arrowButton.scss'

export default function Arrow({side, clicked}) {
    return (
        <Tooltip 
            TransitionComponent={Zoom} 
            title={side == "left" ? "Sell" : "Buy"} 
            placement={side == "left" ? "top-end" : "top-start"}>
            <div onClick={clicked} className={`button-FastForward-${side}`}>
                <div className="arrow">
                    <div className={`arrow-top arrow-top-${side}`}></div>
                    <div className={`arrow-bottom arrow-bottom-${side}`}></div>
                </div>
            </div>
        </Tooltip>
    )
}
