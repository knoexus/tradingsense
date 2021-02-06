import React, { Fragment } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import Zoom from '@material-ui/core/Zoom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import '../../styles/arrowButton.scss'

import { QUERY_LOADING_MIXIN } from '../../apollo-sm/queries'
import { useQuery } from '@apollo/client'

export default function Arrow({side, clicked}) {
    const { data: {loadingMixin } } = useQuery(QUERY_LOADING_MIXIN)
    return (
        <Tooltip 
            TransitionComponent={Zoom} 
            title={side == "left" ? "Sell" : "Buy"} 
            placement={side == "left" ? "top-end" : "top-start"}>
            <Fragment>
                { !loadingMixin && 
                    <div onClick={clicked} className={`button-FastForward-${side}`}>
                        <div className="arrow">
                            <div className={`arrow-top arrow-top-${side}`}></div>
                            <div className={`arrow-bottom arrow-bottom-${side}`}></div>
                        </div>
                        <div className="arrow-small">
                            <div className={`arrow-small-${side}`}>
                                <button className={`arrow-small-button arrow-small-${side}-button`}>
                                    <div>
                                        { side == "left" ? <ArrowBackIcon/> : <ArrowForwardIcon/> }
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </Fragment>
        </Tooltip>
    )
}
