import { Slider } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = {
    root: {
        color: '#dbb448',
        height: 6,
    },
    thumb: {
        height: 20,
        width: 20,
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
        height: 6,
        '&[data-index="0"]':{
            display: 'none'
        }
    },
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 6,
        borderRadius: 3,
    },
    rail: {
        height: 6,
        borderRadius: 3,
    },
}

export default withStyles(styles)(Slider)