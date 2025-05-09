// server/microservices/auth-service/auth-microservice.js
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { parse } from "graphql"; // Import GraphQL parser
import { config } from "./config/config.js";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSubgraphSchema } from "@apollo/subgraph";

import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import connectDB from "./config/mongoose.js";
import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";
//
console.log("🔍 JWT_SECRET in service:", process.env.JWT_SECRET);

// Connect to MongoDB
connectDB();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:4000",
      "https://studio.apollographql.com",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Fix: Parse `typeDefs` before passing it to `buildSubgraphSchema`
const schema = buildSubgraphSchema([{ typeDefs: parse(typeDefs), resolvers }]);
//
const server = new ApolloServer({
  schema,
  introspection: true,
});
//
async function startServer() {
  await server.start();
  //
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        return { req, res };
      },
    })
  );

  //
  //
  app.listen(config.port, () =>
    console.log(
      `🚀 Auth Microservice running at http://localhost:${config.port}/graphql`
    )
  );
}
//
startServer();
