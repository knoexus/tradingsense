import { QUERY_WI, QUERY_LOADING_MIXIN, QUERY_PROFIT_LOSS_PARAMS } from './queries'

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
        changeProfitLossParams: (_, { newFid, newEnddate, newStocks, newAction, newLastPrice }, { cache }) => {
            const data = {
                profit_loss_params: {
                    fid: newFid,
                    endDate: newEnddate,
                    stocks: newStocks,
                    action: newAction,
                    lastPrice: newLastPrice
                }
            }    
            cache.writeQuery({ query: QUERY_PROFIT_LOSS_PARAMS, data })
            return data
        },
    }
}

export default resolvers