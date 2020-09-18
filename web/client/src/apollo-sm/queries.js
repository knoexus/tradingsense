import { gql } from '@apollo/client'

const QUERY_INIT_STATE = gql`{
    wi @client
    loadingMixing @client
  }
  `

const QUERY_WI = gql`{
    wi @client
  }
  `
const QUERY_LOADING_MIXIN = gql`{
    loadingMixing @client
  }
  `

export { QUERY_INIT_STATE, QUERY_WI, QUERY_LOADING_MIXIN }