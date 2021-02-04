import React from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import TechnicalIndicatorsTableRow from './technicals/TechnicalIndicatorsTableRow'

const StyledHeadTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: 'rgba(80, 180, 191, 0.7)',
      color: '#fff',
    },
    root: {
      [theme.breakpoints.down('sm')]: {
        fontSize: 10.5
      }
    }
  }))(TableCell)

const SimplePaper = withStyles(() => ({
    root: {
    },
    elevation1: {
        boxShadow: 'none'
    }
  }))(Paper)

const useStyles = makeStyles(theme => ({
    root: {
      [theme.breakpoints.down('sm')]: {
        fontSize: 10.5
      }
    }
}))

export default function TechnicalIndicatorsTable({indicators, dayX, fid, highlightLockedIndicators, startDate, lockedQ}) {
  const classes = useStyles()
  return (
    <TableContainer component={SimplePaper}>
      <Table size="small" aria-label="TI Table">
        <TableHead>
          <TableRow className={classes.root}>
            <StyledHeadTableCell align="left">Indicator</StyledHeadTableCell>
            <StyledHeadTableCell align="center">Day 0</StyledHeadTableCell>
            <StyledHeadTableCell align="center">Day {dayX}</StyledHeadTableCell>
            <StyledHeadTableCell align="right">Change</StyledHeadTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {indicators.map((e, idx) => 
            <TechnicalIndicatorsTableRow key={idx} data={e} fid={fid} highlightLockedIndicators={highlightLockedIndicators} 
              current_date={startDate} plus_days={dayX} lockedQ={lockedQ}/>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}