import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { MUTATION_SET_ENDGAME } from '../../../apollo-sm/mutations'

export default function CardsCounter({max, current}) {
    const [realMax, changeRealMax] = useState(null)
    const [changeENDGM] = useMutation(MUTATION_SET_ENDGAME)
    useEffect(() => {
        if (current == max){
            changeENDGM({
                variables: {
                    newEndGame: true
                }
            })
            // return null
        }
        else changeRealMax(max)
    }, [current])
    return (
        <div className="cardsCounter">
            <h2>Card {current}/{realMax}</h2>
        </div>
    )
}