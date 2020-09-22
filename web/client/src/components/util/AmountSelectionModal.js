import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'

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
    border: '2px solid #000',
    borderRadius: 5,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    '&:focus': {
        outline: 'none'
    }
  },
}))

export default function AmountSelectionModal({ action, open, proceed, minMaxStocks }) {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle)
  const [_open, setOpen] = useState(open)

  const minStocks = minMaxStocks?.minStocks
  const maxStocks = minMaxStocks?.maxStocks

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2>{actions[action]} the chosen number of stocks</h2>
      <p>Min: {minStocks}</p>
      <p>Max: {maxStocks}</p>
      <button onClick={() => proceed()}>Confirm</button>
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
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  )
}