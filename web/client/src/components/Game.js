import React, { useState, useEffect } from 'react'
import GameWrapper from './util/GameWrapper'
import Mixin from './Mixin'
import Arrow from './util/Arrow'
import AmountSelectionModal from './util/AmountSelectionModal'
import GameSentinel from './GameSentinel'
import { openFullscreen, closeFullscreen } from '../extras/fullScreen'
import { useQuery, useMutation } from '@apollo/client'
import { QUERY_IS_FULLSCREEN } from '../apollo-sm/queries'
import { MUTATION_SET_IS_FULLSCREEN } from '../apollo-sm/mutations'
import { withRouter } from 'react-router-dom'
import { useApolloClient } from '@apollo/client'

import '../styles/game.scss'

function Game(props) {
    const client = useApolloClient()
    const [action, setAction] = useState(-1)
    const [modalOpen, setModal] = useState(false)
    const [mixinUpdater, setMixinUpdate] = useState(false)
    const [stocksPassed, setStocksLeft] = useState(1)
    const [currentMinMaxStocks, setCurrentMinMaxStocks] = useState(null)
    const { data } = useQuery(QUERY_IS_FULLSCREEN)
    const isFullScreen = data?.isFullScreen
    const [changeISFS] = useMutation(MUTATION_SET_IS_FULLSCREEN)

    const openModal = (pos) => {
        setModal(true)
        setAction(pos)
    }

    const closeModal = () => {
        setModal(false)
        setAction(-1)
    }

    const proceed = () => {
        setModal(false)
        setAction(-1)
        setMixinUpdate(!mixinUpdater)
        setStocksLeft(stocksPassed + 1)
    }

    const exit = () => {
        const question = "Are you sure you want to exit?"
        if (window.confirm(question)) props.history.goBack()
    }

    const fullScreenExitHandler = () => {
        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            changeISFS({
                variables: {
                    newIsFullScreen: false
                }
            })
        }
    }  

    const toggleFullScreen = () => {
        if (isFullScreen) closeFullscreen(changeISFS)
        else openFullscreen(changeISFS)
    }

    useEffect(() => {
        document.addEventListener('fullscreenchange', fullScreenExitHandler)
        document.addEventListener('webkitfullscreenchange', fullScreenExitHandler)
        document.addEventListener('mozfullscreenchange', fullScreenExitHandler)
        document.addEventListener('MSFullscreenChange', fullScreenExitHandler)
        return () => {
            client.clearStore()
            document.removeEventListener('fullscreenchange', fullScreenExitHandler)
            document.removeEventListener('webkitfullscreenchange', fullScreenExitHandler)
            document.removeEventListener('mozfullscreenchange', fullScreenExitHandler)
            document.removeEventListener('MSFullscreenChange', fullScreenExitHandler)
        }
    }, [])

    return (
        <GameWrapper>
            <Mixin updater={mixinUpdater} preUpdater={modalOpen} setMinMaxStocks={m => setCurrentMinMaxStocks(m)}/>
            <Arrow side="right" clicked={() => openModal(0)}/>
            <Arrow side="left" clicked={() => openModal(1)}/>
            <GameSentinel stocksPassed={stocksPassed}/>
            <AmountSelectionModal open={modalOpen} action={action} closeModal={() => closeModal()} 
                minMaxStocks={currentMinMaxStocks} proceed={() => proceed()}/>
            <button className="button-GameControl button-GameControl-GameExit" onClick={() => exit()} type="button">Exit</button>
            <button className="button-GameControl button-GameControl-FullScreenControl" onClick={() => toggleFullScreen()} type="button">FullScreen {isFullScreen ? 'Off' : 'On'}</button>
        </GameWrapper>
    )
}

export default withRouter(Game)
