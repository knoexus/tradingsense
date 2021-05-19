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

const MUTATION_SET_POINTS_READY_FOR_ENDGAME = gql`
    mutation changePointsReadyForEndGame($newPointsReadyForEndGame: Boolean!) {
        changePointsReadyForEndGame(newPointsReadyForEndGame: $newPointsReadyForEndGame) @client {
            pointsReadyForEndGame
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

const MUTATION_ADD_TO_CURRENT_POINTS = gql`
    mutation addToCurrentPoints($addPoints: Float!) {
        addToCurrentPoints(addPoints: $addPoints) @client {
            currentPoints
        }
    }
`

const MUTATION_SET_INIT_POINTS = gql`
    mutation changeInitPoints($newInitPoints: Float!) {
        changeInitPoints(newInitPoints: $newInitPoints) @client {
            initPoints
        }
    }
`

const MUTATION_SET_IS_FULLSCREEN = gql`
    mutation changeIsFullScreen($newIsFullScreen: Boolean!) {
        changeIsFullScreen(newIsFullScreen: $newIsFullScreen) @client {
            isFullScreen
        }
    }
`

export { MUTATION_SET_WI, MUTATION_SET_LOADING_MIXIN, MUTATION_SET_PROFIT_LOSS_PARAMS, MUTATION_SET_ENDGAME, MUTATION_SET_POINTS_READY_FOR_ENDGAME,
    MUTATION_SET_CURRENT_POINTS, MUTATION_ADD_TO_CURRENT_POINTS, MUTATION_SET_INIT_POINTS, MUTATION_SET_IS_FULLSCREEN }