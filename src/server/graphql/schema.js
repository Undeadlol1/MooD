import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import UserType from './types/UserType';

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'The root query',
  fields: {
    current_user: {
      description: 'Logged in user',
      type: UserType,
      resolve(post, args, context) {
        return context.user;
      }
    },
  }
});

export default new GraphQLSchema({
  query: RootQuery
});