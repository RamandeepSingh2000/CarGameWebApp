import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { parse } from "graphql";
import { config } from "./config/config.js";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSubgraphSchema } from "@apollo/subgraph";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import connectDB from "./config/mongoose.js";
import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";

// State to track DB connection
let dbConnected = false;
let dbConnectionPromise = null;

// Async function to manage DB connection with retry
const connectToDatabaseWithRetry = async () => {
	const retryInterval = 5000; // Retry every 5 seconds
	const maxRetries = Infinity; // Keep trying indefinitely

	const tryConnect = async (attempt = 1) => {
		try {
			await connectDB();
			dbConnected = true;
			console.log("✅ Connected to MongoDB");
			return true;
		} catch (error) {
			dbConnected = false;
			console.error(
				`❌ DB Connection attempt ${attempt} failed: ${error.message}`
			);
			if (attempt >= maxRetries) {
				console.error("🚨 Max retries reached. Giving up.");
				return false;
			}
			await new Promise((resolve) => setTimeout(resolve, retryInterval));
			return tryConnect(attempt + 1);
		}
	};

	return tryConnect();
};

// Start DB connection in the background
dbConnectionPromise = connectToDatabaseWithRetry();

const app = express();
app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"http://localhost:3001",
			"http://localhost:3002",
			"http://localhost:3006",
			"http://localhost:4004",
			"http://localhost:4000",
			"https://studio.apollographql.com",
		],
		credentials: true,
	})
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
	res.json({
		status: "ok",
		dbConnected,
		uptime: process.uptime(),
	});
});

const schema = buildSubgraphSchema([
	{
		typeDefs: parse(typeDefs),
		resolvers,
	},
]);

const server = new ApolloServer({
	schema,
	introspection: true,
});

async function startServer() {
	await server.start();
	app.use(
		"/graphql",
		expressMiddleware(server, {
			context: async ({ req, res }) => {
				return { req, res, dbConnected }; // Pass dbConnected to resolvers
			},
		})
	);

	app.listen(config.port, () =>
		console.log(
		  `🚀 Game Progress Microservice running at http://localhost:${config.port}/graphql`
		)
	  );
}

startServer().catch((error) => {
	console.error("Failed to start server:", error);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
