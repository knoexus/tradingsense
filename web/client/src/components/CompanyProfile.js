import React from 'react'
import Logo from './util/Logo'
import LockedItem from './util/LockedItem'


export default function CompanyProfile( { data: { _id, ticker, name, logo, exchange, finnhubIndustry } }) {
    const backGrounds = ['red', 'green', 'yellow', 'pink', 'blue']
    const getRandomColorClassName = (defaultClassName, colors) => `${defaultClassName}-color-${colors[Math.floor(Math.random() * colors.length)]}`

    const lock = false
    const coloredBackground = false

    return (
        <div className={`companyProfile ${coloredBackground ? getRandomColorClassName("companyProfile", backGrounds) : ""}`}>
            <div className="companyProfile-content">
                <Logo data={logo} fid={_id}/>
                <div className="companyProfile-info">
                    { !lock ? 
                        (
                            <div className="companyProfile-content-item">
                                <h3>{name}</h3> 
                                <span>{exchange} / {ticker}</span>                              
                            </div>
                        ) :
                            <LockedItem extraClasses={['item-covered-companyProfile-content-name']}/>
                    }
                    { !lock ? 
                        (
                            <div className="companyProfile-content-item">
                                <div className="companyProfile-content-item-sector">
                                    <span>{finnhubIndustry}</span>
                                </div>
                            </div>
                        ) :
                            <LockedItem extraClasses={['item-covered-companyProfile-content-sector']} lockSize={"xl"}/>
                    }
                </div>
            </div>
        </div>
    )
}
