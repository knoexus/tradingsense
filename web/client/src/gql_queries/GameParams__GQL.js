import { gql } from '@apollo/client'

const GAME_PARAMS = gql`
    query getGameParams {
        gameParams {
            secondsToPlay
            numberOfStocks
        }
    }
`

export { GAME_PARAMS }