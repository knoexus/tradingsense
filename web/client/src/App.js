import React from 'react'
import './App.css'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import Game from './components/Game'

const client = new ApolloClient({
  uri: "http://localhost:5001/graphql",
  cache: new InMemoryCache()
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
