import React from 'react'
import { useQuery } from '@apollo/client'
import GameWrapper from './util/GameWrapper'
import { MIXIN_ARGLESS_W_TECHNICALS } from '../gql_queries/MixinArgless__GQL'
import { SPLIT_TECHNICALS_NAMES } from '../gql_queries/Split_Technicals_Names__GQL'
import Mixin from './Mixin'
import MixinSkeleton from './skeletons/MixinSkeleton'
import Arrow from './util/Arrow'

import '../styles/game.scss'

export default function Game() {
    const _takeInPercent = 85
    const _lockedFromTakeInPercent = 20
    let { error: error1, loading: loading1, data: { technicals_names: { unlocked } } } = useQuery(SPLIT_TECHNICALS_NAMES, {
        notifyOnNetworkStatusChange: true,
        variables: {
            _takeInPercent,
            _lockedFromTakeInPercent
        }
    })
    
    const skip = unlocked === undefined
    let { loading, error, data, refetch } = useQuery(MIXIN_ARGLESS_W_TECHNICALS(unlocked), {
        notifyOnNetworkStatusChange: true,
        skip
    })
    if (loading || loading1) return <GameWrapper><MixinSkeleton status={"loading"}/></GameWrapper>
    if (error || error1) return <GameWrapper><p>Error {error} :(</p></GameWrapper>
    if (data) return (
        <GameWrapper>
            <Mixin data={data}/>
            <Arrow side="right" clicked={() => refetch()}></Arrow>
            <Arrow side="left" clicked={() => refetch()}></Arrow>
        </GameWrapper>
    )
}
