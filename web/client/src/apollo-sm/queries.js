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

export { QUERY_INIT_STATE, QUERY_WI, QUERY_LOADING_MIXIN }