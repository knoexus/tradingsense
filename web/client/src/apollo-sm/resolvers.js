import { QUERY_WI, QUERY_LOADING_MIXIN } from './queries'

const resolvers = {
    Mutation: {
        addWi: (_, { }, { cache }) => {
            const queryResult = cache.readQuery({
                query: QUERY_WI
            })      
            if (queryResult) {
                const { wi } = queryResult   
                const data = {
                wi: wi + 1
                }    
                cache.writeQuery({ query: QUERY_WI, data })
                return data.wi
            }
            return null
        },
        changeMixinLoading: (_, { newLoading }, { cache }) => {
            const data = {
                loadingMixin: newLoading
            }    
            cache.writeQuery({ query: QUERY_LOADING_MIXIN, data })
            return data.loadingMixin
        },
    }
}

export default resolvers