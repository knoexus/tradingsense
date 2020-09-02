import React, { useState, Fragment } from 'react'
import { useQuery } from '@apollo/client'
import { TECHNICALS_SINGLE_ALL_UNLOCKED, TECHNICALS_SINGLE_NEXT_LOCKED } from '../../../gql_queries/Technicals__GQL'
import LockedItem from '../LockedItem'
import DefaultSkeleton from '../../skeletons/DefaultSkeleton'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'


export default function TechnicalIndicatorsTableRow({data, fid, highlightLockedIndicators, current_date, plus_days, lockedQ}) {
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
                : !needFetch ? 
                    <TechnicalIndicatorsTableRowContent data={data} highlightLockedIndicators={highlightLockedIndicators}/> 
                    : !lockedQ ?
                    <TechnicalIndicatorsTableRowGQL fid={fid} indicator={data.name} current_date={current_date}
                        errorComponent={LI} highlightLockedIndicators={highlightLockedIndicators}/>
                        : <TechnicalIndicatorsTableRowGQL fid={fid} indicator={data.name} current_date={current_date} plus_days={plus_days} 
                            errorComponent={LI} highlightLockedIndicators={highlightLockedIndicators}/>
            }
         </TableRow>
    )
}

const TechnicalIndicatorsTableRowGQL = ({fid, indicator, errorComponent, current_date, highlightLockedIndicators, plus_days}) => {
    const { loading, error, data } = useQuery((plus_days ? TECHNICALS_SINGLE_ALL_UNLOCKED : TECHNICALS_SINGLE_NEXT_LOCKED), {
        variables: { 
            fid,
            indicator,
            current_date,
            ...(plus_days && { plus_days })
        }
    })
    if (loading) return <TechnicalIndicatorsTableRowContent loading={loading}/>
    if (error) {
        console.error(error)
        return errorComponent
    }
    if (data) return <TechnicalIndicatorsTableRowContent data={plus_days ? data.technicals_single_w_next : data.technicals_single } 
        highlightLockedIndicators={highlightLockedIndicators}/>
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