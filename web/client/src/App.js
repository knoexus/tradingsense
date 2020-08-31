import React from 'react'
import './App.css'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import PreGameSetup from './components/PreGameSetup'

const client = new ApolloClient({
  uri: "http://localhost:5001/graphql",
  cache: new InMemoryCache({
    addTypename: false
  })
})

function App() {
  return (
      <ApolloProvider client={client}>
        <div className="App">
          <PreGameSetup/>
        </div> 
      </ApolloProvider>     
  )
}

export default App
