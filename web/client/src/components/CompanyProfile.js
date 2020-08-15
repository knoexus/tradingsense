import React from 'react'

export default function CompanyProfile( { data: { ticker, name, exchange, finnhubIndustry } }) {
    return (
        <div>
            <h2>Company Profile</h2>
            <p>Ticker: {ticker}</p>
            <p>Name: {name}</p>
            <p>Exchange: {exchange}</p>
            <p>Industry: {finnhubIndustry}</p>
        </div>
    )
}
