import React from 'react'
import Timer from './util/Timer'
import CardsCounter from './util/CardsCounter'
import { Fragment } from 'react'

import { useQuery } from '@apollo/client'
import { GAME_PARAMS } from '../gql_queries/GameParams__GQL'

export default function GameSentinel(props) {
    const { loading, error, data } = useQuery(GAME_PARAMS)

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error {error} :(</p>
    if (data) {
        const { gameParams: { secondsToPlay, numberOfStocks } } = data
        return (
            <Fragment>
                <Timer/>
                <CardsCounter max={numberOfStocks} current={props.stocksPassed}/>
            </Fragment>
        )
    }
}