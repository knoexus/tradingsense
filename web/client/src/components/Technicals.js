import React, { useState, useRef } from 'react'
import DaysSlider from './util/DaysSlider'

export default function Technicals({data}) {
    const [days, changeDays] = useState(1)
    const [daysClassName, changeDaysClassName] = useState('')
    const spanRef = useRef()
    const indicators = data[0]["indicators"]
    
    const restartAnimation = () => {
        const el = spanRef.current
        el.style.animation = 'none' 
        el.getClientRects()
        el.style.animation = ''
    }

    const ordinal_suffix_of = (i) => {
        let j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    }

    const changeDays_ = (newDays) => {
        changeDays(newDays)
        restartAnimation()
        changeDaysClassName('technicals-datechanger-currentval-animated')
    }

    return (
        <div className="technicals">
            <div className="technicals-title"><h2>Technicals</h2></div>
            <div className="technicals-datechanger">
                <div className="technicals-datechanger-slider">
                    <DaysSlider
                        onChange={(_,v) => changeDays_(v)}
                        defaultValue={1}
                        valueLabelDisplay="auto"
                        step={3}
                        marks
                        min={1}
                        max={30}
                    />
                </div>
                <div className="technicals-datechanger-currentval">
                    <span className={daysClassName} ref={spanRef}>+{days} days</span>
                </div>
                <div className="technicals-datechanger-fetcher">
                    <button>Unlock next</button>
                </div>
                <div className="technicals-datechanger-description">
                    <span>Show the unlocked indicators for the {ordinal_suffix_of(days)} day from the start.</span>
                </div>
            </div>
            <div className="technicals-indicators">
                { Object.keys(indicators).map((key, idx) => 
                    <div className="technicals-indicators-item" key={idx}>
                        <span>{key}: {(indicators[key]).toPrecision(2)}</span>
                    </div> 
                )}
            </div>
        </div>
    )
}
