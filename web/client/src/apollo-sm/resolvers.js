import { QUERY_WI, QUERY_LOADING_MIXIN, QUERY_PROFIT_LOSS_PARAMS, QUERY_ENDGAME, QUERY_CURRENT_POINTS } from './queries'

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
            return data.profit_loss_params
        },
        changeEndGame: (_, { newEndGame }, { cache }) => {
            const data = {
                endGame: newEndGame
            }    
            cache.writeQuery({ query: QUERY_ENDGAME, data })
            return data.endGame
        },
        changeCurrentPoints: (_, { newCurrentPoints }, { cache }) => {
            const data = {
                currentPoints: newCurrentPoints
            }    
            cache.writeQuery({ query: QUERY_CURRENT_POINTS, data })
            return data.currentPoints
        },
    }
}

export default resolvers