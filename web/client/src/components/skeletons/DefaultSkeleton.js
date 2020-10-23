import React from 'react'
import { Skeleton } from '@material-ui/lab'
import { withStyles } from '@material-ui/core/styles'

const styles = {
    root: {
        borderRadius: 4.5
    }
}

const DefaultSkeleton = withStyles(styles)(Skeleton)

export default () => <DefaultSkeleton variant="rect" animation="wave" width="100%" height="100%"/>
