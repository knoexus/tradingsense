import React, {Fragment} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Lock from './Lock'

const StyledTableCell = withStyles(() => ({
    head: {
      backgroundColor: 'rgba(80, 180, 191, 0.7)',
      color: '#fff',
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell)

const SimplePaper = withStyles(() => ({
    root: {
    },
    elevation1: {
        boxShadow: 'none'
    }
  }))(Paper)

const useStyles = makeStyles({
  table: {
    maxWidth: 520
  }
})

export default function TechnicalIndicatorsTable({indicators, dayX, highlightLockedIndicators}) {
  const classes = useStyles();

  const lock = (
      <div className="item-covered item-locked item-covered-techinicals-row">
          <Lock size="xl"/>
      </div>
  )

  return (
    <TableContainer component={SimplePaper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Indicator Name</StyledTableCell>
            <StyledTableCell align="center">Day 0 Value</StyledTableCell>
            <StyledTableCell align="center">Day {dayX} Value</StyledTableCell>
            <StyledTableCell align="right">% change</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {indicators.map((e, idx) => (
            <TableRow key={idx}>
              <TableCell align="left">{e.name}</TableCell>
              {
                  e.value !== null ? (
                    <Fragment>
                        <TableCell align="center">{e.value.toPrecision(2)}</TableCell>
                        <TableCell 
                            className={highlightLockedIndicators ? "technicals-indicators-tablecell-highlighted": "" } 
                            align="center">
                            ???
                        </TableCell>
                        <TableCell 
                            className={highlightLockedIndicators ? "technicals-indicators-tablecell-highlighted": "" } 
                            align="right">
                            ???
                        </TableCell>
                    </Fragment>
                  ) :
                    <TableCell colSpan={3}>{lock}</TableCell>
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}