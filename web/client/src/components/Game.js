import React, { useState } from 'react'
import GameWrapper from './util/GameWrapper'
import Mixin from './Mixin'
import Arrow from './util/Arrow'
import AmountSelectionModal from './util/AmountSelectionModal'
import GameSentinel from './GameSentinel'

import '../styles/game.scss'

export default function Game() {
    const [action, setAction] = useState(-1)
    const [modalOpen, setModal] = useState(false)
    const [mixinUpdater, setMixinUpdate] = useState(false)
    const [stocksPassed, setStocksLeft] = useState(0)
    const [currentMinMaxStocks, setCurrentMinMaxStocks] = useState(null)

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

    return (
        <GameWrapper>
            <Mixin updater={mixinUpdater} preUpdater={modalOpen} setMinMaxStocks={m => setCurrentMinMaxStocks(m)}/>
            <Arrow side="right" clicked={() => openModal(0)}/>
            <Arrow side="left" clicked={() => openModal(1)}/>
            <GameSentinel stocksPassed={stocksPassed}/>
            <AmountSelectionModal open={modalOpen} action={action} 
                minMaxStocks={currentMinMaxStocks} proceed={() => proceed()}/>
        </GameWrapper>
    )
}
