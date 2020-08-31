import { gql } from '@apollo/client'

const MIXIN_ARGLESS_W_TECHNICALS = (_unlocked) => gql`
    query getMixinArglessWTechnicals {
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
            technicals {
                t
                indicators {
                    ${_unlocked.join(' ')}
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

export { MIXIN_ARGLESS_W_TECHNICALS, MIXIN_ARGLESS_W_FINANCIALS }