import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { QUERY_PROFIT_LOSS_PARAMS } from '../../../apollo-sm/queries'
import { PROFIT_LOSS } from '../../../gql_queries/ProfitLoss__GQL'


export default function CurrentPoints({amount}) {
    const [total, changeTotal] = useState(amount)
    const calculateChange = (action, amount, oldPrice, newPrice) => {
        console.log(oldPrice, newPrice, amount)
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
            changeTotal(total + calculateChange(action, stocks, lastPrice, profitLoss))   
        }
    }, [data])
    return (
        <div className="currentPoints">
            <h2>Current balance: {total.toPrecision(6)}$</h2>
        </div>
    )
}
