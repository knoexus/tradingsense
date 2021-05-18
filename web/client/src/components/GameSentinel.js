import React, { useEffect, useState } from 'react'
import NTimer from './util/game_sentinel/Timer'
import CardsCounter from './util/game_sentinel/CardsCounter'
import CurrentPoints from './util/game_sentinel/CurrentPoints'
import { Fragment } from 'react'

import ErrorBox from './util/ErrorBox'

import { useQuery } from '@apollo/client'
import { GAME_PARAMS } from '../gql_queries/GameParams__GQL'

export default function GameSentinel(props) {
    const [isFirstRender, setIsFirstRender] = useState(true)
    const { loading, error, data } = useQuery(GAME_PARAMS)
    useEffect(() => {
        if (isFirstRender) {
            if (data) {
                const { gameParams: {numberOfStocks} } = data
                const { setMaxStocks } = props
                setMaxStocks(numberOfStocks)
                setIsFirstRender(false)
            }
        }
    }, [data])
    if (loading) return <p className="sentinel-loading">Loading...</p>
    if (error) return <ErrorBox/>
    if (data) {
        const { gameParams: { secondsToPlay, numberOfStocks, initialSum } } = data
        return (
            <Fragment>
                <CardsCounter max={numberOfStocks} current={props.stocksPassed}/>
                <CurrentPoints amount={initialSum}/>
                <NTimer seconds={secondsToPlay}/>
            </Fragment>
        )
    }
}