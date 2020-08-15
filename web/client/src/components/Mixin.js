import React, { Fragment } from 'react'
import { useQuery } from '@apollo/client'
import MIXIN_ARGLESS from '../gql_queries/MixinArgless'
import CompanyProfile from './CompanyProfile'
import QuotesChart from './QuotesChart'
import FinancialsReported from './FinancialsReported'
import Technicals from './Technicals'

export default function Mixin() {
    const { loading, error, data } = useQuery(MIXIN_ARGLESS)
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :(</p>
    const { mixinArgless: { company_profile, financials_reported, candles, technicals }} = data
    return (
        <Fragment>
            <CompanyProfile data={company_profile}/>
            <QuotesChart data={candles}/>
            <FinancialsReported data={financials_reported}/>
            <Technicals data={technicals}/>
        </Fragment>
    )
}
