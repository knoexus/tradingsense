import { gql } from '@apollo/client'

const MIXIN_W_TECHNICALS = gql`
    query getMixinWTechnicals($daysMargin: Int!, $returnTechnicals: Int!, $lockTechnicals: Int!) {
        mixin(daysMargin: $daysMargin, returnTechnicals: $returnTechnicals, lockTechnicals: $lockTechnicals) {
            startDate
            gap_to_endpoint
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
            technicals {
                t
                indicators {
                    name
                    value
                }
            }
        }
    }
`

const MIXIN_ARGLESS_W_FINANCIALS = gql`
    query getMixinArglessWFinancials {
        mixinArgless {
            startDate
            gap_to_endpoint
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
            financials_reported {
                accessNumber
                startDate
                endDate
                quarter
                year
                report {
                bs {
                    unit
                    label
                    concept
                    value
                }
                cf {
                    unit
                    label
                    concept
                    value
                }
                ic {
                    unit
                    label
                    concept
                    value
                }
                }
            }
        }
    }
`

export { MIXIN_W_TECHNICALS, MIXIN_ARGLESS_W_FINANCIALS }