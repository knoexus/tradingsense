import { QUERY_WI, QUERY_LOADING_MIXIN, QUERY_PROFIT_LOSS_PARAMS, QUERY_ENDGAME, 
    QUERY_CURRENT_POINTS, QUERY_INIT_POINTS, QUERY_IS_FULLSCREEN } from './queries'

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
        addToCurrentPoints: (_, { addPoints }, { cache }) => {
            const queryResult = cache.readQuery({
                query: QUERY_CURRENT_POINTS
            })      
            if (queryResult) {
                const { currentPoints } = queryResult   
                const data = {
                    currentPoints: addPoints + currentPoints
                }    
                cache.writeQuery({ query: QUERY_CURRENT_POINTS, data })
                return data.currentPoints
            }
        },
                changeCurrentPoints: (_, { newCurrentPoints }, { cache }) => {
            const data = {
                currentPoints: newCurrentPoints
            }    
            cache.writeQuery({ query: QUERY_CURRENT_POINTS, data })
            return data.currentPoints
        },
        changeInitPoints: (_, { newInitPoints }, { cache }) => {
            const data = {
                initPoints: newInitPoints
            }    
            cache.writeQuery({ query: QUERY_INIT_POINTS, data })
            return data.initPoints
        },
        changeIsFullScreen: (_, { newIsFullScreen }, { cache }) => {
            const data = {
                isFullScreen: newIsFullScreen
            }    
            cache.writeQuery({ query: QUERY_IS_FULLSCREEN, data })
            return data.isFullScreen
        },
    }
}

export default resolvers