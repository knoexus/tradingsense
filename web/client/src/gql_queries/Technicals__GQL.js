import { gql } from '@apollo/client'

const TECHNICALS_SINGLE_ALL_UNLOCKED = gql`
    query getTechnicalsSingleAllUnlocked($current_date: Int!, $plus_days: Int!, $fid: ID!, $indicator: String!) {
        technicals_single_w_next(current_date: $current_date, plus_days: $plus_days, _id: $fid, indicator: $indicator) {
            value
            valueX
            percentChange
        }
    }
`

const TECHNICALS_SINGLE_NEXT_LOCKED = gql`
    query getTechnicalsForAllAvailable($current_date: Int!, $fid: ID!, $indicator: String!) {
        technicals_single(current_date: $current_date, _id: $fid, indicator: $indicator) {
            value
        }
    }
`

export { TECHNICALS_SINGLE_ALL_UNLOCKED, TECHNICALS_SINGLE_NEXT_LOCKED }