import React, { useState, useRef } from 'react'
import { Slider } from '@material-ui/core'

export default function Technicals({data}) {
    const [days, changeDays] = useState(0)
    const [daysClassName, changeDaysClassName] = useState('')
    const spanRef = useRef()
    const indicators = data[0]["indicators"]
    
    const restartAnimation = () => {
        const el = spanRef.current
        el.style.animation = 'none' 
        el.getClientRects()
        el.style.animation = ''
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
                    <Slider
                        onChange={(_,v) => changeDays_(v)}
                        defaultValue={1}
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={1}
                        max={30}
                    />
                </div>
                <div className="technicals-datechanger-currentval">
                    <span className={daysClassName} ref={spanRef}>+{days} days</span>
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
