import { queryWi } from './queries'

const store = {
    wi: 1,
    // loadingMixing: false
}

export default function createStore(client){
    client.writeQuery({
        query: queryWi,
        data: store
    })
}