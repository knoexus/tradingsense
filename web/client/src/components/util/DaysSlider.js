import React from 'react'
import { Slider } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = {
    root: {
        color: '#481796',
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    mark: {
        height: 8,
        '&[data-index="0"]':{
            display: 'none'
        }
    },
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
}

export default withStyles(styles)(Slider)