import React from 'react'
import LineChart from './util/LineChart'
import { renderItemBasedOnLockState } from './util/renderHelper'

export default function QuotesChart({data}) {
    const lock = true
    return (
        renderItemBasedOnLockState(lock,  (
            <div className="quotesChart">
                <LineChart data={data}/>
            </div>
        ), 
        ["item-locked-quotesChart"], "sm")
    )
}
