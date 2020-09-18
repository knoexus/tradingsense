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

export { MUTATION_SET_WI, MUTATION_SET_LOADING_MIXIN }