import { gql } from '@apollo/client'

const QUERY_INIT_STATE = gql`{
    wi @client
    loadingMixin @client
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

export { QUERY_INIT_STATE, QUERY_WI, QUERY_LOADING_MIXIN, QUERY_PROFIT_LOSS_PARAMS }