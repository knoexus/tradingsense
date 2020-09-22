import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import MinMaxStocksSlider from '../util/MinMaxStocksSlider'
import Button from '@material-ui/core/Button'

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
    width: 400,
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

export default function AmountSelectionModal({ action, open, proceed, minMaxStocks }) {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle)

  const [stocks, changeStocks] = useState(0)
  const [_open, setOpen] = useState(open)

  const minStocks = minMaxStocks?.minStocks
  const maxStocks = minMaxStocks?.maxStocks

  const midValue = Math.ceil((maxStocks+minStocks)/2)

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
          step={Math.floor((maxStocks-minStocks)/10)}
          marks
          min={minStocks}
          max={maxStocks}
        />
        <Button 
          className={actions[action] == "Buy" ? classes.buttonSuccess : classes.buttonDanger }
          onClick={() => proceed()}
          size={"small"} 
          variant="outlined"
          color="#fff"
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
      >
        {body}
      </Modal>
    </div>
  )
}