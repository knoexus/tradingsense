import { queryWi } from './queries'

const resolvers = {
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

export default resolvers