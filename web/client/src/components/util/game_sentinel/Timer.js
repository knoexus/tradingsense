import React, { Fragment } from 'react'
import Timer from 'react-compound-timer'
import { useQuery, useMutation } from '@apollo/client'
import { QUERY_LOADING_MIXIN } from '../../../apollo-sm/queries'
import { MUTATION_SET_ENDGAME } from '../../../apollo-sm/mutations'


export default function NTimer({seconds}) {
    const { data: { loadingMixin } }  = useQuery(QUERY_LOADING_MIXIN)
    const [ changeENDGM ] = useMutation(MUTATION_SET_ENDGAME)
    return (
        <div className="timer">
            <Timer
                initialTime={seconds * 1000}
                direction="backward"
                startImmediately={false}
                checkpoints={[
                    {
                        time: 0,
                        callback: () => changeENDGM({
                            variables: {
                                newEndGame: true
                            }
                        }),
                    },
                ]}
            >
                {({resume, pause}) => {
                    loadingMixin && pause()
                    !loadingMixin && resume()
                    return (
                        <Fragment>
                            <h2>
                                Time: <Timer.Minutes />
                                :
                                <Timer.Seconds formatValue={v => v.toString().length < 2 ? '0' + v : v} />
                            </h2>
                        </Fragment>
                    )
                }}
            </Timer>
        </div>
    )
}