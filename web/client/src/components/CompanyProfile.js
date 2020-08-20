import React from 'react'
import { renderItemBasedOnLockState } from './util/renderHelper'
import '../styles/main.css'

export default function CompanyProfile( { data: { ticker, name, logo, exchange, finnhubIndustry } }) {
    const lock = true
    return (
        <div className="companyProfile">
            <div className="companyProfile-content">
                <div className="companyProfile-logo">
                    { renderItemBasedOnLockState(lock, 
                    <div className="companyProfile-content-item">
                        <img alt={"Logo"} src={logo}></img>
                    </div>
                    ) }
                </div>
                <div className="companyProfile-info">
                    { renderItemBasedOnLockState(lock, 
                    (
                        <div className="companyProfile-content-item">
                            <h3>{name}</h3> 
                            <span>{exchange} / {ticker}</span>                              
                        </div>
                    ), ['item-locked-companyProfile-content-name']) }
                    { renderItemBasedOnLockState(lock, 
                    (
                     <div className="companyProfile-content-item">
                         <span>{finnhubIndustry}</span>
                     </div>
                    ), ['item-locked-companyProfile-content-sector'], "xl") }
                </div>
            </div>
        </div>
    )
}
