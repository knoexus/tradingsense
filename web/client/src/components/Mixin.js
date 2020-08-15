import React from 'react'
import { useQuery } from '@apollo/client'
import MIXIN_ARGLESS from '../gql_queries/MixinArgless'

export default function Mixin() {
    const { loading, error, data } = useQuery(MIXIN_ARGLESS)
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :(</p>
    const { ticker, name, exchange, finnhubIndustry } = data.mixinArgless.company_profile
    return (
        <div>
            <h2>Company Profile</h2>
            <span>Ticker: {ticker}</span>
            <span>Name: {name}</span>
            <span>Exchange: {exchange}</span>
            <span>Industry: {finnhubIndustry}</span>
        </div>
    )
}
