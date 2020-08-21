import React from 'react'
import './App.css'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import Game from './components/Game'

const client = new ApolloClient({
  uri: "http://192.168.31.185:5001/graphql",
  cache: new InMemoryCache({
    addTypename: false
  })
})

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
