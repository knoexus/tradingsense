import { gql } from '@apollo/client'

const TECHNICALS_NEXT_FOR_ALL_AVAILABLE = gql`
    query getCompanyProfileLogo($fid: ID!) {
        company_profile(_id: $fid) {
            logo
        }
    }
`

const TECHNICALS_NEXT_FOR_SINGLE = gql`
    query getCompanyProfileNameExchange($fid: ID!) {
        company_profile(_id: $fid) {
            name
            exchange
            ticker
        }
    }
`

export { TECHNICALS_NEXT_FOR_ALL_AVAILABLE, TECHNICALS_NEXT_FOR_SINGLE }