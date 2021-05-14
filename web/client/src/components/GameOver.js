import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import ErrorBox from './util/ErrorBox'
import { QUERY_INIT_POINTS, QUERY_CURRENT_POINTS } from '../apollo-sm/queries'

import '../styles/gameOver.css'

export default function GameOver() {
    const { loading: loadingCP, error: errorCP, data: dataCP } = useQuery(QUERY_CURRENT_POINTS)
    const { loading: loadingIP, error: errorIP, data: dataIP } = useQuery(QUERY_INIT_POINTS)
    if (loadingIP || loadingCP) return <p>Loading...</p>
    if (errorIP || errorCP) return <ErrorBox/>
    if (dataIP && dataCP) {
        const difference = dataCP.currentPoints - dataIP.initPoints
        return (
            <div className="gameOver">
                <div>
                    <h2>Game Over</h2>
                    <h3>Your score is <b>{dataCP.currentPoints.toFixed(2)}$</b> ({difference >= 0 && '+'}{difference.toFixed(2)})</h3>
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
}
