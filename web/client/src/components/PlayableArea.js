import React from 'react'
import Game from './Game'
import GameOver from './GameOver'
import { useQuery } from '@apollo/client'
import { QUERY_ENDGAME } from '../apollo-sm/queries'

export default function PlayableArea() {
    const { loading, error, data } = useQuery(QUERY_ENDGAME)

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error {error} :(</p>
    if (data) return !data.endGame ? <Game/> : <GameOver score={0}/>
}
