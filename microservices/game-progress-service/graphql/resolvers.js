import GameProgress from "../models/GameProgress.js";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
  fetch,
} from "../apollo-client.cjs";
//Chatbot
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import GameHint from "../models/GameHint.js";
import UserInteraction from "../models/UserInteraction.js";
import { retrieveData } from "../utils/RetrieveData.js";

// ✅ Set up the Apollo Client for Auth Service
const httpLink = createHttpLink({
  uri: "http://localhost:4001/graphql", // Adjust to your auth-microservice GraphQL endpoint
  credentials: "include", // Important for handling cookies properly
  fetch, // ✅ Required for Node.js
});

const authClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache", // Ensure fresh data on each request
    },
  },
});

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  maxOutputTokens: 2048,
});

async function getUser(req) {
  try {
    const token = req.cookies.token; // Assuming the token is stored in cookies
    if (!token) {
      return false;
    }
    // Send GraphQL request
    const response = await authClient.query({
      query: gql`
        query GetUser {
          currentUser {
            id
            username
          }
        }
      `,
      context: {
        headers: { Authorization: `${token}` }, // ✅ Send token via cookies
      },
    });
    return response.data.currentUser;
  } catch (error) {
    console.error("Authentication error:", error.message);
    return false;
  }
}

async function getUserById(id) {
  try {
    console.log("Id:", id);
    // Send GraphQL request
    const response = await authClient.query({
      query: gql`
        query GetUser($id: ID!) {
          user(id: $id) {
            id
            username
          }
        }
      `,
      variables: { id },
    });
    console.log("Response.data.user:", response.data.user);
    return response.data.user;
  } catch (error) {
    console.error("Authentication error:", error.message);
    return false;
  }
}

function isAskingAboutCurrentLevel(input) {
  const patterns = [
    /\bthis level\b[\s\.\?!]*/i,
    /\bwhat (now|should I do)\b[\s\.\?!]*/i,
    /\bwhat (is|happens) (here|next)\b[\s\.\?!]*/i,
    /\bcurrent (objective|goal|task)\b[\s\.\?!]*/i,
    /\bwhat’s (next|up|the plan)\b[\s\.\?!]*/i,
    /\bnow what\b[\s\.\?!]*/i,
    /\bwhat do I do\b[\s\.\?!]*/i,
    /\blevel is this\b[\s\.\?!]*/i,
  ];
  return patterns.some((regex) => regex.test(input));
}

const resolvers = {
  Query: {
    gameProgress: async (_, { id }, context) => {
      const user = await getUser(context.req);
      if (!user) {
        throw new Error("Unauthorized: You must be logged in.");
      }
      const gameProgress = await GameProgress.findById(id);
      const fullGameProgress = {
        ...gameProgress.toObject(),
        id: gameProgress._id.toString(),
        username: user.username,
        lastPlayed: gameProgress.lastPlayed.toISOString(),
      };
      return fullGameProgress;
    },
    gameProgressByUserId: async (_, { userId }, context) => {
      console.log(userId);
      const user = await getUser(context.req);
      if (!user) {
        throw new Error("Unauthorized: You must be logged in.");
      }
      const gameProgress = await GameProgress.findOne({ userId: userId });
      if (!gameProgress) {
        const newGameProgress = new GameProgress({
          userId: user.id,
          experiencePoints: 0,
          score: 0,
          lastPlayed: new Date(),
        });
        console.log(newGameProgress);
        await newGameProgress.save();
        return {
          ...newGameProgress.toObject(),
          id: newGameProgress._id.toString(),
          username: user.username,
          lastPlayed: newGameProgress.lastPlayed.toISOString(),
        };
      }
      const fullGameProgress = {
        ...gameProgress.toObject(),
        id: gameProgress._id.toString(),
        username: user.username,
        lastPlayed: gameProgress.lastPlayed.toISOString(),
      };
      return fullGameProgress;
    },
    leaderboard: async (_, __) => {
      try {
        // Retrieve leaderboard data sorted by score
        const leaderboard = await GameProgress.find({}).sort({ score: -1 });

        // If no leaderboard data is available, throw an error
        if (!leaderboard || leaderboard.length === 0) {
          throw new Error("No leaderboard data available");
        }

        // Map through the leaderboard to attach the username to each entry
        const fullLeaderboard = await Promise.all(
          leaderboard.map(async (gameProgress) => {
            console.log(gameProgress);
            const user = await getUserById(gameProgress.userId.toString());
            return {
              ...gameProgress.toObject(),
              id: gameProgress._id.toString(),
              username: user.username,
            };
          })
        );

        return fullLeaderboard;
      } catch (error) {
        console.error("Error getting leaderboard:", error.message);
        throw new Error("Failed to get leaderboard");
      }
    },
    gameAIQuery: async (_, { input }, context) => {
      console.log("gameAIQuery");
      const user = await getUser(context.req);
      if (!user) {
        throw new Error("Unauthorized: You must be logged in.");
      }
      const userId = user ? user.id : "67c876eefbe93714983e883a";
      try {
        // const pastInteractions = await UserInteraction.find({ userId: user.Id })
        const pastInteractions = await UserInteraction.find({ userId: userId })
          .sort({ createdAt: -1 })
          .limit(3);

        const pastContext = pastInteractions
          .map(
            (i) => `User asked: "${i.query}", AI responded: "${i.aiResponse}"`
          )
          .join("\n");

        const retrievedHints = await retrieveData(input);
        const retrievedData = retrievedHints.join("\n");
        const gameProgress = await GameProgress.findOne({ userId: userId });
        const currentLevel = gameProgress.progress;
        
        const augmentedQuery = `User Query: ${input}
        // \n\nPrevious Interactions:\n${pastContext}
        \n\nHints:\n${retrievedData}
        \n\nInstructions: ${
          isAskingAboutCurrentLevel(input)
            ? "the player is talking about the current level talk about" +
              currentLevel +
              "but don't give away the critical strategies unless specifically asked to, keep answers concise"
            : "don't give away the critical strategies unless specifically asked to, keep answers concise"
        }`;      
        const response = await model.invoke([["human", augmentedQuery]]);
        const aiResponseText = response.content;

        await new UserInteraction({
          userId: userId,
          query: input,
          aiResponse: aiResponseText,
        }).save();

        return {
          text: aiResponseText,
        };
      } catch (error) {
        console.error("Error during AI query processing:", error);
        return {
          text: "An error occurred while processing your request.",
        };
      }
    },
    gameHint: async (_, { level, numberOfDeaths }) => {
      const category =
        numberOfDeaths && numberOfDeaths >= 2
          ? "Critical Strategy"
          : "Strategy";

      const gameHint = await GameHint.find({ level, category });
      if (!gameHint) {
        return "No hints available for this level and category.";
      }
      return gameHint[0].content;
    },
  },
  Mutation: {
    createGameProgress: async (
      _,
      {
        userId,
        experiencePoints,
        score,
        rank,
        achievements,
        progress,
        lastPlayed,
      },
      context
    ) => {
      const newGameProgress = new GameProgress({
        userId,
        experiencePoints,
        score,
        rank,
        achievements,
        progress,
        lastPlayed,
      });
      await newGameProgress.save();

      return {
        id: newGameProgress._id.toString(),
        ...newGameProgress.toObject(),
      };
    },
    updateGameProgress: async (
      _,
      {
        userId,
        experiencePoints,
        score,
        rank,
        achievements,
        progress,
        lastPlayed,
      }
    ) => {
      try {
        const existingProgress = await GameProgress.findOne({ userId });
        if (!existingProgress) {
          const newProgress = new GameProgress({
            userId,
            experiencePoints: experiencePoints || 0,
            score: score || 0,
            rank: rank || null,
            achievements: achievements || [],
            progress: progress || "Not started",
            lastPlayed: lastPlayed || new Date(),
          });
          await newProgress.save();
          return {
            id: newProgress._id.toString(),
            ...newProgress.toObject(),
          };
        }

        // Increment or update fields
        if (experiencePoints !== undefined) {
          existingProgress.experiencePoints = experiencePoints;
        }
        if (score !== undefined) {
          existingProgress.score = score;
        }
        if (rank !== undefined) {
          existingProgress.rank = rank;
        }
        if (achievements !== undefined) {
          // Append new achievements, avoiding duplicates
          achievements.forEach((achievement) => {
            if (!existingProgress.achievements.includes(achievement)) {
              existingProgress.achievements.push(achievement);
            }
          });
        }
        if (progress !== undefined) {
          existingProgress.progress = progress;
        }
        if (lastPlayed !== undefined) {
          existingProgress.lastPlayed = lastPlayed;
        }

        await existingProgress.save();
        return {
          id: existingProgress._id.toString(),
          ...existingProgress.toObject(),
        };
      } catch (error) {
        console.error("Error updating game progress:", error);
        throw new Error("Failed to update game progress");
      }
    },
  },
};

export default resolvers;
