import React from 'react'
import './App.css'
import { ApolloProvider, ApolloClient, InMemoryCache, gql } from '@apollo/client'
import Game from './components/Game'

const queryWi = gql`{
  wi @client
}
`

const client = new ApolloClient({
  uri: "http://localhost:5001/graphql",
  cache: new InMemoryCache({
    addTypename: false
  }),
  resolvers: {
    Mutation: {
      addWi
      :
       (_, { }, { cache }) => {
            const queryResult = cache.readQuery({
              query: queryWi
            })      
            if (queryResult) {
              const { wi } = queryResult   
              const data = {
                wi: wi + 1
              }    
              cache.writeQuery({ query: queryWi, data })
              return data.wi
            }
            return null
          }
        }
      }
})

const initialState = {
  wi: 1
}

client.writeQuery({
  query: queryWi,
  data: initialState
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
