import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A user',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The id of the user.',
    },
    username: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the user.',
    },
    image: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'User image url (usually taken from social websites)'
    },
    vk_id: {
        type: GraphQLString,
        description: 'User\'s vk.com id'
    },
    facebook_id: {
        type: GraphQLString,
        description: 'User\'s facebook.com id'
    },
    twitter_id: {
        type: GraphQLString,
        description: 'User\'s twitter.com id'
    },
    // tasks: {
    //   type: new GraphQLList(taskType),
    //   resolve: resolver(User.Tasks)
    // }
  }
});

export default userType