import React from 'react'
import CompanyProfile from './CompanyProfile'
import QuotesChart from './QuotesChart'
import FinancialsReported from './FinancialsReported'
import Technicals from './Technicals'

export default function Mixin({data}) {
    const { mixin: { startDate, gapToEndpoint, company_profile, financials_reported, 
        daysMargin, candles, technicals_day0, technicals }} = data
    const actual_gapToEndPoint = technicals.length
    return (
        <div className="mixinCard">
            <CompanyProfile data={company_profile}/>
            <QuotesChart data={candles} gapToEndpoint={gapToEndpoint} actual_gapToEndPoint={actual_gapToEndPoint} 
                daysMargin={daysMargin} technicals={technicals}/>
            {/* <FinancialsReported data={financials_reported}/> */}
            <Technicals data={technicals_day0} fid={company_profile._id} gapToEndpoint={gapToEndpoint} 
                actual_gapToEndPoint={actual_gapToEndPoint} startDate={startDate}/>
        </div>
    )
}
