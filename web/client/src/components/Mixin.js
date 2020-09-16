import React from 'react'
import CompanyProfile from './CompanyProfile'
import QuotesChart from './QuotesChart'
import FinancialsReported from './FinancialsReported'
import Technicals from './Technicals'
import MixinSkeleton from './skeletons/MixinSkeleton'

import { useQuery } from '@apollo/client'
import { MIXIN_W_TECHNICALS } from '../gql_queries/Mixin__GQL'
import { useEffect } from 'react'

export default function Mixin({updater}) {
    const variables = {
        returnTechnicals: 7,
        lockTechnicals: 2,
    }

    const params = {
        variables,
        notifyOnNetworkStatusChange: true
    }

    const { loading, error, data, refetch } = useQuery(MIXIN_W_TECHNICALS, params)

    useEffect(() => {
        refetch()
    }, [updater])

    if (loading) return <MixinSkeleton status={"loading"}/>
    if (error) return <p>Error {error} :(</p>
    if (data) {
        const { mixin: { startDate, gapToEndpoint, company_profile, 
            daysMargin, candles, technicals_day0, technicals } } = data
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
}
