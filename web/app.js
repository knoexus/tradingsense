require ('dotenv/config')

const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema')
const mongoose = require('mongoose')
const morgan = require('morgan')

const app = express()

const PORT = process.env.PORT || 5000

const username = encodeURIComponent(process.env.MONGODB_USERNAME)
const password = encodeURIComponent(process.env.MONGODB_PASSWORD)

const clusterUrl = "cluster0.hqaye.mongodb.net"
const authMechanism = "DEFAULT"
const otherParams = "&replicaSet=atlas-13x1az-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"

const uri = `mongodb+srv://${username}:${password}@${clusterUrl}/${process.env.MONGODB_DB_NAME}?authMechanism=${authMechanism}${otherParams}`

app.get('/', (_, res) => res.send("Hello from index"))

app.use(morgan("combined"))

app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: true,
    }),
  )

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => app.listen(PORT, () => console.log(`Running on port ${PORT}`)))
  .catch(err => console.error(err))


