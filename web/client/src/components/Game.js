import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import GameWrapper from './util/GameWrapper'
import { GAME } from '../gql_queries/Game__GQL'
import Mixin from './Mixin'
import MixinSkeleton from './skeletons/MixinSkeleton'
import Arrow from './util/Arrow'
import AmountSelectionModal from './util/AmountSelectionModal'

import '../styles/game.scss'

export default function Game() {
    const [action, setAction] = useState(-1)
    const [modalOpen, setModal] = useState(false)
    const variables = {
        returnTechnicals: 7,
        lockTechnicals: 2,
        setup: true
    }
    const params = {
        variables,
        notifyOnNetworkStatusChange: true,
        returnPartialData: true
    }
    const { loading, error, data, refetch } = useQuery(GAME, params)

    const openModal = (pos) => {
        setModal(true)
        setAction(pos)
    }

    const proceed = () => {
        setModal(false)
        setAction(-1)
        refetch({
            ...params,
            variables: {
                ...variables,
                setup: false
            }
        })
    }

    if (loading) return <GameWrapper><MixinSkeleton status={"loading"}/></GameWrapper>
    if (error) return <GameWrapper><p>Error {error} :(</p></GameWrapper>
    if (data) {
        const { game: { gameParams, mixin } } = data
        return (
            <GameWrapper>
                <Mixin data={mixin}/>
                <Arrow side="right" clicked={() => openModal(0)}/>
                <Arrow side="left" clicked={() => openModal(1)}/>
                {/* Timer */}
                {/* CardsCounter */}
                <AmountSelectionModal open={modalOpen} action={action} proceed={() => proceed()}/>
            </GameWrapper>
        )
    }
}
