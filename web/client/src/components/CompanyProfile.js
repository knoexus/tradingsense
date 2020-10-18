import React from 'react'
import Logo from './util/company_profile/Logo'
import LockedItem from './util/LockedItem'
import NamingExpansion from './util/company_profile/NamingExpansion'
import Industry from './util/company_profile/Industry'


export default function CompanyProfile( { data: { _id, nameTickerExchange, logo, finnhubIndustry } }) {
    const backGrounds = ['red', 'green', 'yellow', 'pink', 'blue']
    const getRandomColorClassName = (defaultClassName, colors) => `${defaultClassName}-color-${colors[Math.floor(Math.random() * colors.length)]}`
    const coloredBackground = false
    return (
        <div className={`companyProfile ${coloredBackground ? getRandomColorClassName("companyProfile", backGrounds) : ""}`}>
            <div className="companyProfile-content">
                <Logo data={logo} fid={_id}/>
                <div className="companyProfile-info">
                    <NamingExpansion data={nameTickerExchange} fid={_id}/>
                    <Industry data={finnhubIndustry} fid={_id}/>
                </div>
            </div>
        </div>
    )
}
