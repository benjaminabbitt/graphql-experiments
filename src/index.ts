import {graphql, buildSchema} from "graphql";
import { makeExecutableSchema } from 'graphql-tools';
import { find, filter } from 'lodash';

// Construct a schema, using GraphQL schema language
export const schema =`
type Author {
  id: ID! # the ! means that every author object _must_ have an id
  firstName: String
  lastName: String
  posts: [Post] # the list of Posts by this author
}

type Post {
  id: ID!
  title: String
  author: Author
  votes: Int
}

# the schema allows the following query:
type Query {
  posts: [Post]
}

# this schema allows the following mutation:
type Mutation {
  upvotePost (
    postId: ID!
  ): Post
}

# we need to tell the server which types represent the root query
# and root mutation types. We call them RootQuery and RootMutation by convention.
schema {
  query: Query
  mutation: Mutation
}
`;

const authors = [
  { id: 1, firstName: 'Tom', lastName: 'Coleman' },
  { id: 2, firstName: 'Sashko', lastName: 'Stubailo' },
];

const posts = [
  { id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2 },
  { id: 2, authorId: 2, title: 'GraphQL Rocks', votes: 3 },
  { id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1 },
];

const resolverMap = {
  Query: {
    posts() {
      return posts;
    },
  },
  Mutation: {
    upvotePost(_: any, { postId } : {postId: any} ) {
      const post = find(posts, { id: postId });
      if (!post) {
        throw new Error(`Couldn't find post with id ${postId}`);
      }
      post.votes += 1;
      return post;
    },
  },
  Author: {
    posts(author: any) {
      return filter(posts, { authorId: author.id });
    },
  },
  Post: {
    author(post: any) {
      return find(authors, { id: post.authorId });
    },
  },
};


export const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolverMap,
});

// // The root provides a resolver function for each API endpoint
// const root = {
//   hello: () => {
//     return 'Hello world!';
//   },
// };

// Run the GraphQL query '{ hello }' and print out the response
// graphql(schema, '{ hello }', root).then((response) => {
//   console.log(response);
// });