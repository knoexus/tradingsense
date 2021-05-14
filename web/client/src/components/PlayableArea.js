import React from 'react'
import Game from './Game'
import GameOver from './GameOver'
import { useQuery } from '@apollo/client'
import { QUERY_ENDGAME } from '../apollo-sm/queries'
import ErrorBox from './util/ErrorBox'

export default function PlayableArea() {
    const { loading, error, data } = useQuery(QUERY_ENDGAME)
    if (loading) return <p>Loading...</p>
    if (error) return <ErrorBox/>
    if (data) return !data.endGame ? <Game/> : <GameOver/>
}
