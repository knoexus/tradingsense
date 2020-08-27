import { gql } from '@apollo/client'

const COMPANY_PROFILE_LOGO = gql`
    query getCompanyProfileLogo($fid: ID!) {
        company_profile(_id: $fid) {
            logo
        }
    }
`

const COMPANY_PROFILE_NAME_EXCHANGE = gql`
    query getCompanyProfileNameExchange($fid: ID!) {
        company_profile(_id: $fid) {
            name
            exchange
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

export { COMPANY_PROFILE_LOGO, COMPANY_PROFILE_NAME_EXCHANGE, COMPANY_PROFILE_INDUSTRY }