import { QUERY_INIT_STATE } from './queries'

const store = {
    wi: 1,
    loadingMixin: false,
    profit_loss_params: null,
    endGame: false,
    initPoints: 0,
    currentPoints: 0,
    isFullScreen: false
}

export default function createStore(client){
    client.writeQuery({
        query: QUERY_INIT_STATE,
        data: store
    })
}