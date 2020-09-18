import React from 'react'
import { useQuery } from '@apollo/client'
import { QUERY_WI } from '../../../apollo-sm/queries'


export default function Timer() {
    const { data: { wi } } = useQuery(QUERY_WI)
    return (
        <div className="timer">
            <h3>{wi}</h3>
        </div>
    )
}
