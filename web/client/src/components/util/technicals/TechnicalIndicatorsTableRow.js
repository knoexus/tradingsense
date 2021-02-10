import React, { useState, Fragment } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { TECHNICALS_SINGLE_ALL_UNLOCKED, TECHNICALS_SINGLE_NEXT_LOCKED } from '../../../gql_queries/Technicals__GQL'
import { MUTATION_ADD_TO_CURRENT_POINTS } from '../../../apollo-sm/mutations'
import LockedItem from '../LockedItem'
import DefaultSkeleton from '../../skeletons/DefaultSkeleton'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { withStyles } from '@material-ui/core/styles'

const StyledTableCell = withStyles(theme => ({
    root: {
      [theme.breakpoints.down('sm')]: {
        fontSize: 10.5
      }
    }
  }))(TableCell)

export default function TechnicalIndicatorsTableRow({data, fid, highlightLockedIndicators, current_date, plus_days, lockedQ}) {
    const [lock, changeLock] = useState(data.value === null)
    const [needFetch, changeFetchNeeded] = useState(false)
    const [addToCP] = useMutation(MUTATION_ADD_TO_CURRENT_POINTS)
    const logoUnlockTry = () => {
        changeLock(!lock)
        changeFetchNeeded(!needFetch)
        addToCP({
            variables: {
                addPoints: -data.price
            }
        })
    }

    const LI = (
        <StyledTableCell colSpan={3}>
             <LockedItem price={data.price} unlockTry={logoUnlockTry} extraClasses={["item-covered-technicals-row"]} lockSize={"xl"}/>
        </StyledTableCell>
    )

    const C = (() => {
        if (lock) return LI
        else {
            if (!needFetch) {
                if (!lockedQ) return <TechnicalIndicatorsTableRowContent data={data} highlightLockedIndicators={highlightLockedIndicators}/> 
                else return (
                    <TechnicalIndicatorsTableRowGQL fid={fid} indicator={data.name} current_date={current_date} plus_days={plus_days} 
                            errorComponent={LI} highlightLockedIndicators={highlightLockedIndicators}/>
                )
            }
            else {
                if (!lockedQ) return (
                    <TechnicalIndicatorsTableRowGQL fid={fid} indicator={data.name} current_date={current_date}
                        errorComponent={LI} highlightLockedIndicators={highlightLockedIndicators}/>
                )
                else return (
                    <TechnicalIndicatorsTableRowGQL fid={fid} indicator={data.name} current_date={current_date} plus_days={plus_days} 
                            errorComponent={LI} highlightLockedIndicators={highlightLockedIndicators}/>
                )
            }
        }
    })()

    return (
        <TableRow>
            <StyledTableCell align="left">{data.name}</StyledTableCell>
            { C }
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
    const isDataPercentage = (data?.percentChange !== undefined && data?.percentChange !== null)
    return (
        <Fragment>
            { loading && 
                <StyledTableCell colSpan={3}>
                    <div className="item-covered item-covered-technicals-row">
                        <DefaultSkeleton/>
                    </div>
                </StyledTableCell> } 
            { data && 
                <Fragment>
                    <StyledTableCell align="center">{data.value ? data.value.toPrecision(2) : 0}</StyledTableCell>
                    <StyledTableCell 
                        className={!data.valueX && highlightLockedIndicators ? "technicals-indicators-tablecell-highlighted": "" } 
                        align="center">
                        {data.valueX ? data.valueX.toPrecision(2) : "???"}
                    </StyledTableCell>
                    <StyledTableCell 
                        className={(!isDataPercentage && highlightLockedIndicators ? "technicals-indicators-tablecell-highlighted": "")
                                    + " " + (isDataPercentage && Math.round(data.percentChange) > 0 ? "technicals-indicators-tablecell-positive" : 
                                    Math.round(data.percentChange) < 0 ? "technicals-indicators-tablecell-negative" : "")} 
                        align="right">
                        {isDataPercentage ? Math.round(data.percentChange) + '%' : "???"}
                    </StyledTableCell>
                </Fragment>
            }
        </Fragment>
    )
}