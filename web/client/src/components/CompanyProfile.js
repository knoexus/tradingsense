import React, {Fragment} from 'react'
import Lock from './util/Lock'
import '../styles/main.css'

export default function CompanyProfile( { data: { ticker, name, logo, exchange, finnhubIndustry } }) {
    const lock = true
    const renderItemBasedOnLockState = (state, element, divExtraClasses, lockSize) => 
        !state ?
        (
            <div className="companyProfile-content-item">
                { element }
            </div>
        ) : 
        (
            <div className={`companyProfile-content-item-locked ${divExtraClasses ? divExtraClasses.join(' ') : ''}`}>
                <Lock size={lockSize}/>
            </div>
        )
    return (
        <div className="companyProfile">
            <div className="companyProfile-content">
                <div className="companyProfile-logo">
                    { renderItemBasedOnLockState(lock, <img alt={"Logo"} src={logo}></img>) }
                </div>
                <div className="companyProfile-info">
                    { renderItemBasedOnLockState(lock, 
                    (
                        <Fragment>
                            <h3>{name}</h3> 
                            <span>{exchange} / {ticker}</span>                              
                        </Fragment>
                    ), ['companyProfile-content-item-locked-name']) }
                    { renderItemBasedOnLockState(lock, <span>{finnhubIndustry}</span>, ['companyProfile-content-item-locked-sector'], "xl") }
                </div>
            </div>
        </div>
    )
}
