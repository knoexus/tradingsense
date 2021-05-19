import React from 'react'
import Game from './Game'
import GameOver from './GameOver'
import { useQuery } from '@apollo/client'
import { QUERY_ENDGAME, QUERY_POINTS_READY_FOR_ENDGAME } from '../apollo-sm/queries'
import ErrorBox from './util/ErrorBox'

export default function PlayableArea() {
    const { loading: loadingENDGM, error: errorENDGM, data: dataENDGM } = useQuery(QUERY_ENDGAME)
    const { loading: loadingPRFENDGM, error: errorPRFENDGM, data: dataPRFENDGM } = useQuery(QUERY_POINTS_READY_FOR_ENDGAME)
    if (loadingENDGM || loadingPRFENDGM) return <p>Loading...</p>
    if (errorENDGM || errorPRFENDGM) return <ErrorBox/>
    if (dataENDGM && dataPRFENDGM) {
        if (dataENDGM.endGame && dataPRFENDGM.pointsReadyForEndGame) return <GameOver/>
        else return <Game/>
    }
    return <Game/>
}