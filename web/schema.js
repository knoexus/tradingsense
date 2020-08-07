const { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLSchema } = require('graphql')
const { _CompanyProfile } = require('./mongoose_models')

const CompanyProfile = new GraphQLObjectType({
    name: 'CompanyProfile',
    fields: () => ({
        country: { type: GraphQLString },
        currency: { type: GraphQLString },
        exchange: { type: GraphQLString },
        finnhubIndustry: { type: GraphQLString },
        ipo: { type: GraphQLString },
        logo: { type: GraphQLString },
        marketCapitalization: { type: GraphQLFloat },
        name: { type: GraphQLString },
        phone: { type: GraphQLInt },
        shareOutstanding: { type: GraphQLFloat },
        ticker: { type: GraphQLString },
        weburl: { type: GraphQLString }
    })
})
 
const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        company_profile: {
            type: CompanyProfile,
            args: {
                ticker: { type: GraphQLString }
            },
            resolve(_, args) {
                const query = _CompanyProfile.where({ ticker: args.ticker })
                return query.findOne((err, obj) => {
                    if (err) {
                        return null
                    }
                    if (obj) {
                        return obj
                    }
                })
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery
  });