import React, { useEffect } from 'react'
import Timer from 'react-compound-timer'
import { useQuery, useMutation } from '@apollo/client'
import { QUERY_LOADING_MIXIN } from '../../../apollo-sm/queries'
import { MUTATION_SET_ENDGAME } from '../../../apollo-sm/mutations'

const withTimer = timerProps => WrappedComponent => wrappedComponentProps => (
    <Timer {...timerProps}>
      {timerRenderProps =>
        <WrappedComponent {...wrappedComponentProps} timer={timerRenderProps} />}
    </Timer>
  )
  
const TimerWrapper = (props) => {
    const { data: { loadingMixin } }  = useQuery(QUERY_LOADING_MIXIN)
    const [ changeENDGM ] = useMutation(MUTATION_SET_ENDGAME)
    useEffect(() => {
        const { seconds, timer: { setTime }} = props
        setTime(1000 * seconds)
    }, [props.seconds])
    useEffect(() => {
        const { timer: { setCheckpoints } } = props
        setCheckpoints([
            {
                time: 0,
                callback: () => changeENDGM({
                    variables: {
                        newEndGame: true
                    }
                })
            }
        ])
    })
    useEffect(() => {
        const { resume, pause } = props.timer
        loadingMixin === true ? pause() : resume()
    }, [loadingMixin])
    return (
        <div className="timer">
            <h2>
                Time: <Timer.Minutes />
                :
                <Timer.Seconds formatValue={v => v.toString().length < 2 ? '0' + v : v} />
            </h2>
        </div>
    )
}
  
export default withTimer({
    direction: 'backward',
    startImmediately: false
})(TimerWrapper)