// server/microservices/auth-service/graphql/typeDefs.js
// GraphQL type definitions
const typeDefs = `#graphql
  type GameProgress {    
    id: ID!
    userId: ID!
    experiencePoints: Int!
    score: Int!
    rank: Int
    achievements: [String]
    progress: String
    lastPlayed: String
    username: String
  }

  type AIResponse {
    text: String!    
  }

  type UserInteraction {
    id: ID!
    userId: String!
    query: String!
    aiResponse: String!
    createdAt: String!
  }

  type Query {
    gameProgress(id:ID): GameProgress
    gameProgressByUserId(userId: ID): GameProgress    
    leaderboard: [GameProgress]
    gameAIQuery(input: String!): AIResponse!
    gameHint(level: Int!, numberOfDeaths: Int): String!
  }

  type Mutation {
    createGameProgress(
      userId: ID!,
      experiencePoints: Int,
      score: Int,
      rank: Int,
      achievements: [String],
      progress: String,
      lastPlayed: String
    ): GameProgress

    updateGameProgress(
      userId: ID!,
      experiencePoints: Int,
      score: Int,
      rank: Int,
      achievements: [String],
      progress: String,
      lastPlayed: String
    ): GameProgress    
  }

`;

// Export as an ES Module
export default typeDefs;
