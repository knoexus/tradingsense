import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { QUERY_PROFIT_LOSS_PARAMS } from '../../../apollo-sm/queries'
import { PROFIT_LOSS } from '../../../gql_queries/ProfitLoss__GQL'
import { MUTATION_SET_CURRENT_POINTS } from '../../../apollo-sm/mutations'


export default function CurrentPoints({amount}) {
    const [total, changeTotal] = useState(amount)
    const [lastChange, setLastChange] = useState(null)
    const [changeCP] = useMutation(MUTATION_SET_CURRENT_POINTS)
    const calculateChange = (action, amount, oldPrice, newPrice) => {
        if (action == 'Buy') return (newPrice-oldPrice) * amount
        else return (oldPrice-newPrice) * amount
    }
    const { data: dataPLP, error: errorPLP, loading: loadingPLP } = useQuery(QUERY_PROFIT_LOSS_PARAMS)
    const variables = {
        fid: dataPLP?.profit_loss_params?.fid,
        date: dataPLP?.profit_loss_params?.endDate,
    }
    const params = {
        variables,
        notifyOnNetworkStatusChange: true,
        skip: dataPLP == undefined,
    }
    const { data, error, loading } = useQuery(PROFIT_LOSS, params)
    useEffect(() => {
        if (data) {
            const { profit_loss_params: { stocks, action, lastPrice } } = dataPLP
            const { profitLoss } = data
            const change = calculateChange(action, stocks, lastPrice, profitLoss)
            changeTotal(total + change)   
            setLastChange(change)
        }
    }, [data])
    useEffect(() => {
        changeCP({
            variables: {
                newCurrentPoints: total
            }
        })
    }, [total])
    return (
        <div className="currentPoints">
            <h2>Current balance: {total.toFixed(2)}$ 
                {lastChange ? 
                    lastChange > 0 ? ` (+${lastChange.toFixed(2)})` : ` (${lastChange.toFixed(2)})`
                    : ''}</h2>
        </div>
    )
}
