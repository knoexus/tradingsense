import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import MinMaxStocksSlider from '../util/MinMaxStocksSlider'
import Button from '@material-ui/core/Button'

import { useMutation } from '@apollo/client'
import { MUTATION_SET_PROFIT_LOSS_PARAMS } from '../../apollo-sm/mutations'

const actions = {
    0: "Buy",
    1: "Sell"
}

const getModalStyle = () => {
  const top = 50
  const left = 50
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    maxWidth: '80vw',
    [theme.breakpoints.down('sm')]: {
      width: 300,
    },
    [theme.breakpoints.up('sm')]: {
      width: 450,
    },
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    borderRadius: 7,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3, 3),
    '&:focus': {
        outline: 'none'
    }
  },
  buttonDanger: {
    color: '#FF0000',
    borderColor: '#FF0000'
  },
  buttonSuccess: {
    color: '#008000',
    borderColor: '#008000'
  },
}))

export default function AmountSelectionModal({ action, open, proceed, closeModal, minMaxStocks }) {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle)

  const [stocks, changeStocks] = useState(0)
  const [_open, setOpen] = useState(open)

  const [changePLP] = useMutation(MUTATION_SET_PROFIT_LOSS_PARAMS)

  const minStocks = minMaxStocks?.minMaxStocks?.minStocks
  const maxStocks = minMaxStocks?.minMaxStocks?.maxStocks

  const midValue = Math.ceil((maxStocks+minStocks)/2)

  const confirmAction = () => {
    const endDate = minMaxStocks?.endDate
    const fid = minMaxStocks?.fid
    const lastPrice = minMaxStocks?.lastPrice
    changePLP({
      variables: {
          newFid: fid,
          newEnddate: endDate,
          newStocks: stocks,
          newAction: actions[action],
          newLastPrice: lastPrice
      }
    })
    proceed()
  }

  useEffect(() => {
    changeStocks(midValue)
  }, [minMaxStocks])

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className="modal-stocks-inner">
        <h2>{actions[action]} the selected number of stocks</h2>
        <MinMaxStocksSlider
          onChange={(_, v) => changeStocks(v)}
          defaultValue={midValue}
          valueLabelDisplay="auto"
          step={(maxStocks-minStocks) >= 10 ? Math.floor((maxStocks-minStocks)/10) : 1}
          marks
          min={minStocks}
          max={maxStocks}
        />
        <Button 
          className={actions[action] == "Buy" ? classes.buttonSuccess : classes.buttonDanger }
          onClick={() => confirmAction()}
          size={"small"} 
          variant="outlined"
        >Confirm {actions[action]}ing {stocks} stocks
        </Button>
      </div>
    </div>
  )
  
  useEffect(() => {
    setOpen(open)
  }, [open])

  return (
    <div>
      <Modal
        disableAutoFocus
        disableEnforceFocus
        open={_open}
        onClose={() => closeModal()}
      >
        {body}
      </Modal>
    </div>
  )
}