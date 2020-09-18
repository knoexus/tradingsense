import { gql } from '@apollo/client'

const MUTATION_SET_WI = gql`
    mutation addWi($plus: Int!) {
        addWi(plus: $plus) @client {
            wi
        }
    }
    `

export { MUTATION_SET_WI }