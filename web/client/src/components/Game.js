import React from 'react'
import { useQuery } from '@apollo/client'
import GameWrapper from './util/GameWrapper'
import { MIXIN_ARGLESS_W_TECHNICALS } from '../gql_queries/MixinArgless__GQL'
import Mixin from './Mixin'
import MixinSkeleton from './skeletons/MixinSkeleton'
import Arrow from './util/Arrow'

import '../styles/game.scss'

export default function Game({technicals_names, skip, reload}) {
    const { loading, error, data } = useQuery(MIXIN_ARGLESS_W_TECHNICALS(technicals_names.unlocked), {
        skip,
        notifyOnNetworkStatusChange: true,
    })
    if (loading) return <GameWrapper><MixinSkeleton status={"loading"}/></GameWrapper>
    if (error) return <GameWrapper><p>Error {error} :(</p></GameWrapper>
    if (data) return (
        <GameWrapper>
            <Mixin data={data}/>
            <Arrow side="right" clicked={() => reload()}></Arrow>
            <Arrow side="left" clicked={() => reload()}></Arrow>
        </GameWrapper>
    )
}
