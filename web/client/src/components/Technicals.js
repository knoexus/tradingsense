import React, { useState, useRef } from 'react'
import DaysSlider from './util/DaysSlider'
import TechnicalIndicatorsTable from './util/TechnicalIndicatorsTable'
import { Button } from '@material-ui/core'
import { MUTATION_ADD_TO_CURRENT_POINTS } from '../apollo-sm/mutations'
import { useMutation } from '@apollo/client'

export default function Technicals({data, fid, gapToEndpoint, actual_gapToEndPoint, startDate, unlock_all_prices}) {
    const { min } = unlock_all_prices
    const [days, changeDays] = useState(1)
    const [currentUnlockAllPrice, changeCurrentUnlockAllPrice] = useState(min)
    const [lockedQ, changelockedStateQ] = useState(false)
    const [highlightLockedIndicators, changeHighlight] = useState(false)
    const [daysClassName, changeDaysClassName] = useState('')
    const [addToCP] = useMutation(MUTATION_ADD_TO_CURRENT_POINTS)
    const spanRef = useRef()
    const indicators = data.indicators
    
    const restartAnimation = () => {
        const el = spanRef.current
        el.style.animation = 'none' 
        el.getClientRects()
        el.style.animation = ''
    }

    const ordinal_suffix_of = i => {
        let j = i % 10,
            k = i % 100
        if (j == 1 && k != 11) return i + "st"
        if (j == 2 && k != 12) return i + "nd"
        if (j == 3 && k != 13) return i + "rd"
        return i + "th"
    }

    const priceFormula = (currentDays) => {
        if (currentDays == 1) return min
        else return Math.ceil(min * (currentDays+actual_gapToEndPoint)/actual_gapToEndPoint)
    }

    const changeDays_ = (newDays) => {
        changeDays(newDays)
        changeCurrentUnlockAllPrice(priceFormula(newDays))
        restartAnimation()
        changeDaysClassName('technicals-datechanger-currentval-animated')
    }

    const changelockedStateQ_ = (newLockState) => {
        changelockedStateQ(newLockState)
        addToCP({
            variables: {
                addPoints: -currentUnlockAllPrice
            }
        })
    }

    return (
        <div className="technicals">
            <div className="technicals-title"><h2>Technicals</h2></div>
            <div className="technicals-datechanger" disabled={lockedQ}>
                <div className="technicals-datechanger-slider">
                    <DaysSlider
                        onChange={lockedQ ? x=>x : (_,v) => changeDays_(v)}
                        defaultValue={1}
                        valueLabelDisplay="auto"
                        step={gapToEndpoint % 3 == 0 ? 3 : 2}
                        marks
                        min={1}
                        max={actual_gapToEndPoint}
                    />
                </div>
                <div className="technicals-datechanger-currentval">
                    <span className={daysClassName} ref={spanRef}>+{days} days</span>
                </div>
                <div className="technicals-datechanger-fetcher">
                    <Button 
                        onMouseEnter={lockedQ ? x=>x : () => changeHighlight(!highlightLockedIndicators)} 
                        onMouseLeave={lockedQ ? x=>x : () => changeHighlight(!highlightLockedIndicators)}
                        onClick={lockedQ ? x=>x : () => changelockedStateQ_(true)}
                        size={"small"} 
                        variant="outlined"
                        disabled={lockedQ}>
                        Unlock -{currentUnlockAllPrice}$
                    </Button>
                </div>
                <div className="technicals-datechanger-description">
                    <span>Show the unlocked indicators for the {ordinal_suffix_of(days)} trading day from the start.</span>
                </div>
            </div>
            <div className="technicals-indicators">
                <TechnicalIndicatorsTable indicators={indicators} dayX={days} fid={fid} 
                    highlightLockedIndicators={highlightLockedIndicators} startDate={startDate} lockedQ={lockedQ}/>
            </div>
        </div>
    )
}
