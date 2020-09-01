import React from 'react'
import CompanyProfile from './CompanyProfile'
import QuotesChart from './QuotesChart'
import FinancialsReported from './FinancialsReported'
import Technicals from './Technicals'

export default function Mixin({data}) {
    const { mixin: { startDate, gapToEndpoint, company_profile, financials_reported, candles, technicals }} = data
    return (
        <div className="mixinCard">
            <CompanyProfile data={company_profile}/>
            <QuotesChart data={candles} gapToEndpoint={gapToEndpoint}/>
            {/* <FinancialsReported data={financials_reported}/> */}
            <Technicals data={technicals} fid={company_profile._id} gapToEndpoint={gapToEndpoint} startDate={startDate}/>
        </div>
    )
}
