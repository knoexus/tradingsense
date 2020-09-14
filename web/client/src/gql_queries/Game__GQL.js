import { gql } from '@apollo/client'

const GAME = gql`
    query getGame($returnTechnicals: Int!, $lockTechnicals: Int!, $setup: Boolean!) {
        game(returnTechnicals: $returnTechnicals, lockTechnicals: $lockTechnicals) {
            gameParams @include(if: $setup) {
                secondsToPlay
                numberOfStocks
            }
            mixin {
                startDate
                gapToEndpoint
                daysMargin
                company_profile {
                    _id
                    ticker
                    name
                    logo
                    exchange
                    finnhubIndustry
                }
                candles {
                    close
                    volume
                    high
                    low
                    timestamp
                }
                technicals_day0 {
                    symbol
                    t
                    indicators {
                        name
                        value
                    }
                }
                technicals {
                    indicators {
                        name
                        value
                    }
                }
            }
        }
    }
`

export { GAME }