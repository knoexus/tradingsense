import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { QUERY_PROFIT_LOSS_PARAMS, QUERY_CURRENT_POINTS } from '../../../apollo-sm/queries'
import { PROFIT_LOSS } from '../../../gql_queries/ProfitLoss__GQL'
import { MUTATION_SET_CURRENT_POINTS, MUTATION_SET_ENDGAME } from '../../../apollo-sm/mutations'


export default function CurrentPoints({amount}) {
    const [isFirstRender, changeIsFirstRender] = useState(true)
    const [total, changeTotal] = useState(amount)
    const [lastChange, setLastChange] = useState(null)

    const [changeCP] = useMutation(MUTATION_SET_CURRENT_POINTS)
    const [changeENDGM] = useMutation(MUTATION_SET_ENDGAME)

    const calculateChange = (action, amount, oldPrice, newPrice) => {
        if (action == 'Buy') return (newPrice-oldPrice) * amount
        else return (oldPrice-newPrice) * amount
    }

    const { data: dataCP, error: errorCP, loading: loadingCP } = useQuery(QUERY_CURRENT_POINTS)  
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
        if (!isFirstRender)
            changeTotal(dataCP.currentPoints)
    }, [dataCP])

    useEffect(() => {
        if (data) {
            const { profit_loss_params: { stocks, action, lastPrice } } = dataPLP
            const { profitLoss } = data
            const change = calculateChange(action, stocks, lastPrice, profitLoss)
            changeIsFirstRender(false)
            changeTotal(total + change)   
            setLastChange(change)
        }
    }, [data])

    useEffect(() => {
        changeIsFirstRender(false)
        changeCP({
            variables: {
                newCurrentPoints: total
            }
        })
        if (total < 0){
            changeENDGM({
                variables: {
                    newEndGame: true
                }
            })
        }
    }, [total])
    return (
        <div className="currentPoints">
            <h2>{total.toFixed(2)}$ 
                {lastChange ? 
                    lastChange > 0 ? ` (+${lastChange.toFixed(2)})` : ` (${lastChange.toFixed(2)})`
                    : ''}</h2>
        </div>
    )
}
