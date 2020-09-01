import React from 'react'
import CompanyProfile from './CompanyProfile'
import QuotesChart from './QuotesChart'
import FinancialsReported from './FinancialsReported'
import Technicals from './Technicals'

export default function Mixin({data}) {
    const { mixin: { startDate, gap_to_endpoint, company_profile, financials_reported, candles, technicals }} = data
    return (
        <div className="mixinCard">
            <CompanyProfile data={company_profile}/>
            <QuotesChart data={candles} gap_to_endpoint={gap_to_endpoint}/>
            {/* <FinancialsReported data={financials_reported}/> */}
            <Technicals data={technicals} startDate={startDate}/>
        </div>
    )
}
