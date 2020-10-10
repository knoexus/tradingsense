import { gql } from '@apollo/client'

const MUTATION_SET_WI = gql`
    mutation addWi($plus: Int!) {
        addWi(plus: $plus) @client {
            wi
        }
    }
    `

const MUTATION_SET_LOADING_MIXIN = gql`
    mutation changeMixinLoading($newLoading: Boolean!) {
        changeMixinLoading(newLoading: $newLoading) @client {
            loadingMixin
        }
    }
    `

const MUTATION_SET_PROFIT_LOSS_PARAMS = gql`
    mutation changeProfitLossParams($newFid: ID!, $newEnddate: Int!, $newStocks: Int!, $newAction: String!, $newLastPrice: Float!) {
        changeProfitLossParams(newFid: $newFid, newEnddate: $newEnddate, newStocks: $newStocks, newAction: $newAction, newLastPrice: $newLastPrice) @client {
            profit_loss_params {
                endDate 
                fid 
                stocks 
                action 
                lastPrice
            }
        }
    }
    `

const MUTATION_SET_ENDGAME = gql`
    mutation changeEndGame($newEndGame: Boolean!) {
        changeEndGame(newEndGame: $newEndGame) @client {
            endGame
        }
    }
`


const MUTATION_SET_CURRENT_POINTS = gql`
    mutation changeCurrentPoints($newCurrentPoints: Float!) {
        changeCurrentPoints(newCurrentPoints: $newCurrentPoints) @client {
            currentPoints
        }
    }
`


export { MUTATION_SET_WI, MUTATION_SET_LOADING_MIXIN, MUTATION_SET_PROFIT_LOSS_PARAMS, MUTATION_SET_ENDGAME,
    MUTATION_SET_CURRENT_POINTS }