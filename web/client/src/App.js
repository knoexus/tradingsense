import React from 'react'
import './App.css'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import Game from './components/Game'
import createStore from './apollo-sm/store'
import resolvers from './apollo-sm/resolvers'

const client = new ApolloClient({
  uri: "http://localhost:5001/graphql",
  cache: new InMemoryCache({
    addTypename: false
  }),
  resolvers
})

createStore(client)

function App() {
  return (
      <ApolloProvider client={client}>
        <div className="App">
          <Game/>
        </div> 
      </ApolloProvider>     
  )
}

export default App
