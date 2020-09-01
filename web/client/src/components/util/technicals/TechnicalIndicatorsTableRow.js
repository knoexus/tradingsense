import React, { useState, Fragment } from 'react'
import { useQuery } from '@apollo/client'
import { TECHNICALS_SINGLE_ALL_UNLOCKED } from '../../../gql_queries/Technicals__GQL'
import LockedItem from '../LockedItem'
import DefaultSkeleton from '../../skeletons/DefaultSkeleton'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'


export default function TechnicalIndicatorsTableRow({data, fid, highlightLockedIndicators, current_date, plus_days}) {
    const [lock, changeLock] = useState(data.value === null)
    const [needFetch, changeFetchNeeded] = useState(false)
    const logoUnlockTry = () => {
        changeLock(!lock)
        changeFetchNeeded(!needFetch)
    }

    const LI = (
        <TableCell colSpan={3}>
             <LockedItem unlockTry={logoUnlockTry} extraClasses={["item-covered-techinicals-row"]} lockSize={"xl"}/>
        </TableCell>
    )

    return (
        <TableRow>
            <TableCell align="left">{data.name}</TableCell>
            { lock ? 
                LI
            : needFetch ? 
                <TechnicalIndicatorsTableRowGQL fid={fid} indicator={data.name} current_date={current_date} plus_days={plus_days} 
                    errorComponent={LI} highlightLockedIndicators={highlightLockedIndicators}/>
            :
                <TechnicalIndicatorsTableRowContent data={data} highlightLockedIndicators={highlightLockedIndicators}/>
            }
         </TableRow>
    )
}

const TechnicalIndicatorsTableRowGQL = ({fid, indicator, errorComponent, current_date, plus_days, highlightLockedIndicators}) => {
    const { loading, error, data } = useQuery(TECHNICALS_SINGLE_ALL_UNLOCKED, {
        variables: { 
            fid,
            indicator,
            plus_days,
            current_date
        }
    })
    if (loading) return <TechnicalIndicatorsTableRowContent loading={loading}/>
    if (error) {
        console.error(error)
        return errorComponent
    }
    if (data) return <TechnicalIndicatorsTableRowContent data={data.technicals_single_w_next} highlightLockedIndicators={highlightLockedIndicators}/>
}

const TechnicalIndicatorsTableRowContent = ({loading, data, highlightLockedIndicators}) => {
    return (
        <Fragment>
            { loading && <TableCell colSpan={3}><DefaultSkeleton/></TableCell> } 
            { data && 
                <Fragment>
                    <TableCell align="center">{data.value.toPrecision(2)}</TableCell>
                    <TableCell 
                        className={!data.valueX && highlightLockedIndicators ? "technicals-indicators-tablecell-highlighted": "" } 
                        align="center">
                        {data.valueX ? data.valueX.toPrecision(2) : "???"}
                    </TableCell>
                    <TableCell 
                        className={!data.percentChange && highlightLockedIndicators ? "technicals-indicators-tablecell-highlighted": "" } 
                        align="right">
                        {data.percentChange ? Math.round(data.percentChange) : "???"}
                    </TableCell>
                </Fragment>
            }
        </Fragment>
    )
}