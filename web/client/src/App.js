import React from 'react'
import './App.css'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import PlayableArea from './components/PlayableArea'
import Home from './components/site/Home'
import createStore from './apollo-sm/store'
import resolvers from './apollo-sm/resolvers'
import BaseRoute from './components/util/routes/BaseRoute'
import GameRoute from './components/util/routes/GameRoute'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

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
        <Router>
          <div className="App">
            <Switch>
              <GameRoute path="/game">
                  <PlayableArea />
              </GameRoute>
              <BaseRoute path="/" component={() => <Home/>}>
              </BaseRoute>
            </Switch>
          </div> 
        </Router>
      </ApolloProvider>     
  )
}

export default App
