import { gql } from '@apollo/client'

const QUERY_INIT_STATE = gql`{
    wi @client
    loadingMixin @client
    endGame @client
    currentPoints @client
  }
  `

const QUERY_WI = gql`{
    wi @client
  }
  `
const QUERY_LOADING_MIXIN = gql`{
    loadingMixin @client
  }
  `

const QUERY_ENDGAME = gql`{
    endGame @client
  }
  `
const QUERY_CURRENT_POINTS = gql`{
    currentPoints @client
  }
  `

const QUERY_PROFIT_LOSS_PARAMS = gql`{
    profit_loss_params @client {
      endDate 
      fid 
      stocks 
      action
      lastPrice 
    }
}
`

const QUERY_IS_FULLSCREEN = gql`{
  isFullScreen @client
}
`

export { QUERY_INIT_STATE, QUERY_WI, QUERY_LOADING_MIXIN, QUERY_PROFIT_LOSS_PARAMS, QUERY_ENDGAME,
    QUERY_CURRENT_POINTS, QUERY_IS_FULLSCREEN }