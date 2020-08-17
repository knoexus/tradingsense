import React from 'react'
import LineChart from './util/LineChart'

export default function QuotesChart({data}) {
    return (
        <div>
            <LineChart data={data}/>
        </div>
    )
}
