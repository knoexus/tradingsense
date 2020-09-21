import { gql } from '@apollo/client'

const GAME_PARAMS = gql`
    query getGameParams {
        gameParams {
            secondsToPlay
            numberOfStocks
            initialSum
        }
    }
`

export { GAME_PARAMS }