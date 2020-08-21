import React, { Fragment } from 'react'
import { useQuery } from '@apollo/client'
import GameWrapper from './util/GameWrapper'
import MIXIN_ARGLESS from '../gql_queries/MixinArgless'
import Mixin from './Mixin'
import MixinSkeleton from './skeletons/MixinSkeleton'

import '../styles/game.css'

export default function Game() {
    const { loading, error, data, refetch } = useQuery(MIXIN_ARGLESS, {
        notifyOnNetworkStatusChange: true
    })
    if (loading) return <GameWrapper><MixinSkeleton status={"loading"}/></GameWrapper>
    if (error) return <GameWrapper><p>Error {error} :(</p></GameWrapper>
    if (data) return (
        <GameWrapper>
            <Mixin data={data}/>
            <button onClick={() => refetch()} className="button-FastForward">Refetch</button>
        </GameWrapper>
    )
}
