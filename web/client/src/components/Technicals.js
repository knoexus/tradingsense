import React from 'react'

const numberWithCommas = (x) => x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '???'

export default function Technicals({data}) {
    const indicators = data[0]["indicators"]
    return (
        <div className="technicals">
            <h2>Technicals</h2>
            { Object.keys(indicators).map((key, idx) => <span key={idx}>{key}: {indicators[key]}</span> )}
        </div>
    )
}
