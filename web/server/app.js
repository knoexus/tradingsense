require ('dotenv/config')

const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

const PORT = process.env.PORT || 5000

const username = encodeURIComponent(process.env.MONGODB_USERNAME)
const password = encodeURIComponent(process.env.MONGODB_PASSWORD)
const dbname = encodeURIComponent(process.env.MONGODB_DB_NAME)
const clusterUrl = encodeURIComponent(process.env.MONGODB_CLUSTER_URL)

const uri = `mongodb+srv://${username}:${password}@${clusterUrl}/${dbname}`

app.get('/', (_, res) => res.send("Hello from index"))

app.use(cors())

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


