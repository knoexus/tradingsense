import { gql } from '@apollo/client'

const COMPANY_PROFILE_LOGO = gql`
    query getCompanyProfileLogo($fid: ID!) {
        company_profile(_id: $fid) {
            logo
        }
    }
`

const COMPANY_PROFILE_NAME_EXCHANGE_TICKER = gql`
    query getCompanyProfileNameExchange($fid: ID!) {
        company_profile(_id: $fid) {
            name
            exchange
            ticker
        }
    }
`

const COMPANY_PROFILE_INDUSTRY = gql`
    query getCompanyProfileIndustry($fid: ID!) {
        company_profile(_id: $fid) {
            finnhubIndustry
        }
    }
`

export { COMPANY_PROFILE_LOGO, COMPANY_PROFILE_NAME_EXCHANGE_TICKER, COMPANY_PROFILE_INDUSTRY }