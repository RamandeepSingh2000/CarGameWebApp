// server/microservices/auth-service/graphql/typeDefs.js
// GraphQL type definitions
const typeDefs = `#graphql
  type User {   
    id: ID!
    username: String!
    email: String!
    role: String!
    password: String!
  }

  type Query {
    user(id: ID!): User
    currentUser: User
  }

  type Mutation {
    login(username: String!, password: String!): User
    register(
    username: String!,
    email: String!,
    role: String!, 
    password: String!): User
    logout: String
  }

`;

// Export as an ES Module
export default typeDefs;
