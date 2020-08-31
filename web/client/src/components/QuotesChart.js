import React, { Fragment } from 'react'
import LineChart from './util/LineChart'
import LockedItem from './util/LockedItem'

export default function QuotesChart(props) {
    const lock = false
    return (
        <Fragment>
            {
                !lock ?
                (
                    <div className="quotesChart">
                        <LineChart {...props}/>
                    </div>
                ) :
                    <LockedItem extraClasses={["item-covered-quotesChart"]} lockSize={"sm"}/>
            }
        </Fragment>
    )
}
