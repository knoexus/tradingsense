import React, { Fragment } from 'react'
import { useQuery } from '@apollo/client'
import MIXIN_ARGLESS from '../gql_queries/MixinArgless'
import Mixin from './Mixin'

import '../styles/game.css'

export default function Game() {
    const { loading, error, data, refetch } = useQuery(MIXIN_ARGLESS, {
        notifyOnNetworkStatusChange: true
    })
    let result
    if (loading) result = <p>Loading...</p>
    if (error) result = <p>Error {error} :(</p>
    if (data) result = (
        <Fragment>
            <Mixin data={data}/>
            <button onClick={() => refetch()} className="button-FastForward">Refetch</button>
        </Fragment>
    )
    return (
        <div className="game">
            { result }
        </div>
    )
}
