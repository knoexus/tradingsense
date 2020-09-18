import React, { useState } from 'react'
import GameWrapper from './util/GameWrapper'
import Mixin from './Mixin'
import Arrow from './util/Arrow'
import AmountSelectionModal from './util/AmountSelectionModal'
import GameSentinel from './GameSentinel'

import { useMutation, gql } from '@apollo/client'

import '../styles/game.scss'

export default function Game() {
    const [action, setAction] = useState(-1)
    const [modalOpen, setModal] = useState(false)
    const [mixinUpdater, setMixinUpdate] = useState(false)
    const [stocksPassed, setStocksLeft] = useState(0)

    const openModal = (pos) => {
        setModal(true)
        setAction(pos)
    }

    const proceed = () => {
        setModal(false)
        setAction(-1)
        setMixinUpdate(!mixinUpdater)
        setStocksLeft(stocksPassed + 1)
    }

    const SET_WASTE = gql`
        mutation addWi($plus: Int!) {
            addWi(plus: $plus) @client {
                wi
            }
        }
    `
    const [wiMutate] = useMutation(SET_WASTE)

    return (
        <GameWrapper>
            <Mixin updater={mixinUpdater}/>
            <Arrow side="right" clicked={() => openModal(0)}/>
            <Arrow side="left" clicked={() => openModal(1)}/>
            <GameSentinel stocksPassed={stocksPassed}/>
            <AmountSelectionModal open={modalOpen} action={action} proceed={() => proceed()}/>
            <button
                onClick={() => {
                    wiMutate({
                        variables: {
                            plus: 1
                        }
                    })
                }}
            >Apollo Test</button>
        </GameWrapper>
    )
}
