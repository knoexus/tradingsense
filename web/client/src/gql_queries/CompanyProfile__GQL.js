import { gql } from '@apollo/client'

const COMPANY_PROFILE_LOGO = gql`
    query getCompanyProfileLogo($fid: ID!) {
        company_profile(_id: $fid) {
            logo {
                value
                price
            }
        }
    }
`

const COMPANY_PROFILE_NAME_TICKER_EXCHANGE = gql`
    query getCompanyProfileNameTickerExchange($fid: ID!) {
        company_profile(_id: $fid) {
            nameTickerExchange {
                value {
                    name
                    ticker
                    exchange
                }
                price
            }
        }
    }
`

const COMPANY_PROFILE_INDUSTRY = gql`
    query getCompanyProfileIndustry($fid: ID!) {
        company_profile(_id: $fid) {
            finnhubIndustry {
                value
                price
            }
        }
    }
`

export { COMPANY_PROFILE_LOGO, COMPANY_PROFILE_NAME_TICKER_EXCHANGE, COMPANY_PROFILE_INDUSTRY }