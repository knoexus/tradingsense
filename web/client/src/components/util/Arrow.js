import React, { Fragment } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import Zoom from '@material-ui/core/Zoom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import { makeStyles } from '@material-ui/core/styles'
import '../../styles/arrowButton.scss'

import { QUERY_LOADING_MIXIN } from '../../apollo-sm/queries'
import { useQuery } from '@apollo/client'

const useStyles = makeStyles(() => {
    const dimVal = '1.28em'
    return {
        root: {
            width: dimVal,
            height: dimVal
        }
    }
})

export default function Arrow({side, clicked}) {
    const classes = useStyles()
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
                                        { side == "left" ? <ArrowBackIcon className={classes.root}/> : <ArrowForwardIcon className={classes.root}/> }
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
