import React from 'react'
import { useQuery, gql } from '@apollo/client'

const mixinArgless = gql`
query getCompanyProfile {
    company_profile_random {
        currency,
        exchange
    }
}
`

export default function Mixin() {
    const { loading, error, data } = useQuery(mixinArgless)
    console.log(data)
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :(</p>
    return <h2>Hi</h2>
}
