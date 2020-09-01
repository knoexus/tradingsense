import React from 'react'
import { useQuery } from '@apollo/client'
import GameWrapper from './util/GameWrapper'
import { MIXIN_W_TECHNICALS } from '../gql_queries/Mixin__GQL'
import Mixin from './Mixin'
import MixinSkeleton from './skeletons/MixinSkeleton'
import Arrow from './util/Arrow'

import '../styles/game.scss'

export default function Game() {
    const { loading, error, data, refetch } = useQuery(MIXIN_W_TECHNICALS, {
        variables: {
            daysMargin: 90,
            returnTechnicals: 7,
            lockTechnicals: 2
        },
        notifyOnNetworkStatusChange: true
    })
    if (loading) return <GameWrapper><MixinSkeleton status={"loading"}/></GameWrapper>
    if (error) return <GameWrapper><p>Error {error} :(</p></GameWrapper>
    if (data) return (
        <GameWrapper>
            <Mixin data={data}/>
            <Arrow side="right" clicked={() => refetch()}></Arrow>
            <Arrow side="left" clicked={() => refetch()}></Arrow>
        </GameWrapper>
    )
}
