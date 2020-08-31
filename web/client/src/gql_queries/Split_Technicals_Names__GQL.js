import { gql } from '@apollo/client'

const SPLIT_TECHNICALS_NAMES = gql`
    query getSplitTechnicalsNames($_takeInPercent: Float!, $_lockedFromTakeInPercent: Float!) {
        technicals_names(takeInPercent: $_takeInPercent, lockedFromTakeInPercent: $_lockedFromTakeInPercent) {
            locked
            unlocked
        }
    }
`

export { SPLIT_TECHNICALS_NAMES }