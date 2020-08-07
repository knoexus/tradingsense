const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema')
const { MongoClient } = require('mongodb')
require ('dotenv/config')

const app = express()

const PORT = process.env.PORT || 5000

const username = encodeURIComponent(process.env.MONGODB_USERNAME);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const clusterUrl = "cluster0.hqaye.mongodb.net"

const authMechanism = "DEFAULT";

const otherParams = "&replicaSet=atlas-13x1az-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"

// Replace the following with your MongoDB deployment's connection string.
const uri = `mongodb+srv://${username}:${password}@${clusterUrl}/?authMechanism=${authMechanism}${otherParams}`;

// Create a new MongoClient
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const profile = await client.db("tradingsense").collection("company_profile").findOne({ "ticker": "AAPL" })
    console.log("Connected successfully to server")
    return (`<img src="${profile.logo}"></img>`)
  } finally {
    await client.close();
  }
}

app.get('/', (req, res) => {
  run()
    .then(img => res.send(img))
    .catch(console.dir)
})

app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: true,
    }),
  );

app.listen(PORT, () => console.log(`Running on port ${PORT}`))
