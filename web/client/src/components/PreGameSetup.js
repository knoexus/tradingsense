import React from 'react'
import { useQuery } from '@apollo/client'
import { SPLIT_TECHNICALS_NAMES } from '../gql_queries/Split_Technicals_Names__GQL'
import Game from './Game'

export default function PreGameSetup() {
    const _takeInPercent = 85
    const _lockedFromTakeInPercent = 20
    const { loading, error, data, refetch } = useQuery(SPLIT_TECHNICALS_NAMES, {
        notifyOnNetworkStatusChange: true,
        variables: {
            _takeInPercent,
            _lockedFromTakeInPercent
        },
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'network-only'
    })
    const skip = data === undefined
    if (loading) return null
    if (error) return null
    if (data) return <Game technicals_names={data.technicals_names} skip={skip} reload={refetch}/>
}
