import { gql } from '@apollo/client'

const TECHNICALS_MANY = gql`
    query getTechnicalsForAllAvailable($next_date: Int!) {
        technicals_single(next_date: $next_date) {
            day0
            dayX
            percentChange
        }
    }
`

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
    query getTechnicalsForAllAvailable($next_date: Int!) {
        technicals_single(next_date: $next_date) {
            day0
            dayX
            percentChange
        }
    }
`

export { TECHNICALS_MANY, TECHNICALS_SINGLE_ALL_UNLOCKED, TECHNICALS_SINGLE_NEXT_LOCKED }