import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, 50%)',
    maxWidth: '80vw',
    [theme.breakpoints.down('sm')]: {
      width: 300,
    },
    [theme.breakpoints.up('sm')]: {
      width: 450,
    },
  },
  button: {
      maxHeight: 35,
      color: 'inherit'
  }
}))

export default function SimpleAlerts({text}) {
  const classes = useStyles()
  return (
    <div className={classes.root}>
        <Alert severity="error" action={<Button className={classes.button} size="small" onClick={() => window.location.reload()}>Reload</Button>}>
            <AlertTitle>Error</AlertTitle>
            {text ?? "Something *not so terrible* happened."}
        </Alert>
    </div>
  );
}