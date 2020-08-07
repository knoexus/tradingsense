const { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLSchema } = require('graphql')
 
const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {

    }
})


module.exports = new GraphQLSchema({
    query: RootQuery
  });