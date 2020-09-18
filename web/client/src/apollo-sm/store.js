import { QUERY_INIT_STATE } from './queries'

const store = {
    wi: 1,
    loadingMixing: false
}

export default function createStore(client){
    client.writeQuery({
        query: QUERY_INIT_STATE,
        data: store
    })
}