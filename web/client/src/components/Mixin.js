import React from 'react'
import CompanyProfile from './CompanyProfile'
import QuotesChart from './QuotesChart'
import FinancialsReported from './FinancialsReported'
import Technicals from './Technicals'
import MixinSkeleton from './skeletons/MixinSkeleton'

import ErrorBox from '../components/util/ErrorBox'

import { useQuery } from '@apollo/client'
import { MIXIN_W_TECHNICALS } from '../gql_queries/Mixin__GQL'
import { useEffect } from 'react'

import { useMutation } from '@apollo/client'
import { MUTATION_SET_LOADING_MIXIN } from '../apollo-sm/mutations'

export default function Mixin({updater, preUpdater, setMinMaxStocks}) {
    const variables = {
        returnTechnicals: 6,
        lockTechnicals: 2,
    }

    const params = {
        variables,
        notifyOnNetworkStatusChange: true
    }

    const [changeMXN] = useMutation(MUTATION_SET_LOADING_MIXIN)

    const { loading, error, data, refetch } = useQuery(MIXIN_W_TECHNICALS, params)

    useEffect(() => {
        preUpdater && data && setMinMaxStocks({
            minMaxStocks: data.mixin.minMaxStocks,
            endDate: data.mixin.endDate,
            fid: data.mixin.company_profile._id,
            lastPrice: data.mixin.candles[data.mixin.candles.length-1].close
        })
    }, [preUpdater])

    useEffect(() => {
        refetch()
    }, [updater])

    if (loading) {
        changeMXN({
            variables: {
                newLoading: true
            }
        })
        return <MixinSkeleton status={"loading"}/>
    }
    if (error) return <ErrorBox/>
    if (data) {
        changeMXN({
            variables: {
                newLoading: false
            }
        })
        const { mixin: { startDate, gapToEndpoint, company_profile, 
            daysMargin, candles, technicals_day0, technicals, technicals_all_prices } } = data
        const actual_gapToEndPoint = technicals.length
        return (
            <div className="mixinCard">
                <CompanyProfile data={company_profile}/>
                <QuotesChart data={candles} actual_gapToEndPoint={actual_gapToEndPoint} 
                    daysMargin={daysMargin}/>
                {/* <FinancialsReported data={financials_reported}/> */}
                <Technicals data={technicals_day0} unlock_all_prices={technicals_all_prices} fid={company_profile._id} 
                    gapToEndpoint={gapToEndpoint} actual_gapToEndPoint={actual_gapToEndPoint} startDate={startDate}/>
            </div>
        )
    }
}
