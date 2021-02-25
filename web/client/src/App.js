import React from 'react'
import './App.css'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import PlayableArea from './components/PlayableArea'
import Home from './components/site/Home'
import Rules from './components/site/Rules'
import createStore from './apollo-sm/store'
import resolvers from './apollo-sm/resolvers'
import BaseRoute from './components/util/routes/BaseRoute'
import GameRoute from './components/util/routes/GameRoute'
import {
  BrowserRouter as Router,
  Switch
} from 'react-router-dom'

const client = new ApolloClient({
  uri: `${process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_ENDPOINT : process.env.REACT_APP_DEV_ENDPOINT }/graphql`,
  cache: new InMemoryCache({
    addTypename: false
  }),
  resolvers
})

createStore(client)
client.onClearStore(() => createStore(client))

function App() {
  return (
      <ApolloProvider client={client}>
        <Router>
          <div className="App">
            <Switch>
              <GameRoute exact path="/game">
                  <PlayableArea />
              </GameRoute>
              <BaseRoute exact path="/" component={() => <Home/>}/>
              <BaseRoute exact path="/rules" component={() => <Rules/>}/>
            </Switch>
          </div> 
        </Router>
      </ApolloProvider>     
  )
}

export default App
