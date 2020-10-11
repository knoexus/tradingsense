import React from 'react'
import Game from './Game'
import GameOver from './GameOver'
import { useQuery } from '@apollo/client'
import { QUERY_ENDGAME, QUERY_CURRENT_POINTS } from '../apollo-sm/queries'

export default function PlayableArea() {
    const { loading, error, data } = useQuery(QUERY_ENDGAME)
    const { loading: loadingP, error: errorP, data: dataP } = useQuery(QUERY_CURRENT_POINTS, {
        skip: data === undefined
    })
    if (loading || loadingP) return <p>Loading...</p>
    if (error || errorP) return <p>Error:(</p>
    if (data && dataP) return !data.endGame ? <Game/> : <GameOver score={dataP.currentPoints}/>
}
