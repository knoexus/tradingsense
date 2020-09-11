import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import GameWrapper from './util/GameWrapper'
import { MIXIN_W_TECHNICALS } from '../gql_queries/Mixin__GQL'
import Mixin from './Mixin'
import MixinSkeleton from './skeletons/MixinSkeleton'
import Arrow from './util/Arrow'
import AmountSelectionModal from './util/AmountSelectionModal'

import '../styles/game.scss'

export default function Game() {
    const [action, setAction] = useState(-1)
    const [modalOpen, setModal] = useState(false)
    const { loading, error, data, refetch } = useQuery(MIXIN_W_TECHNICALS, {
        variables: {
            returnTechnicals: 7,
            lockTechnicals: 2
        },
        notifyOnNetworkStatusChange: true
    })

    const openModal = (pos) => {
        setModal(true)
        setAction(pos)
    }

    const proceed = () => {
        setModal(false)
        setAction(-1)
        refetch()
    }

    if (loading) return <GameWrapper><MixinSkeleton status={"loading"}/></GameWrapper>
    if (error) return <GameWrapper><p>Error {error} :(</p></GameWrapper>
    if (data) return (
        <GameWrapper>
            <Mixin data={data}/>
            <Arrow side="right" clicked={() => openModal(0)}></Arrow>
            <Arrow side="left" clicked={() => openModal(1)}></Arrow>
            <AmountSelectionModal open={modalOpen} action={action} proceed={() => proceed()}/>
        </GameWrapper>
    )
}
