import React from 'react'
import '../styles/main.css'

export default function CompanyProfile( { data: { ticker, name, logo, exchange, finnhubIndustry } }) {
    return (
        <div className="companyProfile">
            <h2>Company Profile</h2>
            <div className="companyProfile-content">
                <div className="companyProfile-logo">
                    <img alt={"Logo"} src={logo}></img>
                </div>
                <div className="companyProfile-info">
                    <h3>{name}</h3>
                    <span>{exchange} / {ticker}</span>
                    <span>{finnhubIndustry}</span>
                </div>
            </div>
        </div>
    )
}
