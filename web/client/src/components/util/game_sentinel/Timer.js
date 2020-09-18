import React, { Fragment } from 'react'
import Timer from 'react-compound-timer'
import { useQuery } from '@apollo/client'
import { QUERY_LOADING_MIXIN } from '../../../apollo-sm/queries'


export default function NTimer({seconds}) {
    const { data: { loadingMixin } }  = useQuery(QUERY_LOADING_MIXIN)
    return (
        <div className="timer">
            <Timer
                initialTime={seconds * 1000}
                direction="backward"
                startImmediately={false}
            >
                {({resume, pause}) => {
                    loadingMixin && pause()
                    !loadingMixin && resume()
                    return (
                        <Fragment>
                            <Timer.Minutes />
                            :
                            <Timer.Seconds formatValue={v => v.toString().length < 2 ? '0' + v : v} />
                        </Fragment>
                    )
                }}
            </Timer>
        </div>
    )
}