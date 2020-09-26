import { gql } from '@apollo/client'

const PROFIT_LOSS = gql`
    query getProfitLoss($fid: ID!, $date: Int!) {
        profitLoss (_id: $fid, date: $date)
    }
`

export { PROFIT_LOSS }