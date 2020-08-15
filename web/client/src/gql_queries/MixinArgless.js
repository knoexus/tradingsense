import { gql } from '@apollo/client'

const MIXIN_ARGLESS = gql`
    query getMixinArgless {
        mixinArgless {
            company_profile {
                ticker
                name
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
            technicals {
                t
                ATR
                ADX
                MACD
                AD
                AROONOSC
                SAR
                OBV
                SLOWK
            }
        }
    }
`

export default MIXIN_ARGLESS