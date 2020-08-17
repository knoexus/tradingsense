import React from 'react'
import CompanyProfile from './CompanyProfile'
import QuotesChart from './QuotesChart'
import FinancialsReported from './FinancialsReported'
import Technicals from './Technicals'

import '../styles/main.css'

export default function Mixin({data}) {
    const { mixinArgless: { company_profile, financials_reported, candles, technicals }} = data
    return (
        <div className="mixinCard">
            <CompanyProfile data={company_profile}/>
            <QuotesChart data={candles}/>
            <FinancialsReported data={financials_reported}/>
            <Technicals data={technicals}/>
        </div>
    )
}
