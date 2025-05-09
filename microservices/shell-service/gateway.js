import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// ✅ Fix: Add middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS and Cookie Parsing
app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"http://localhost:3001",
			"http://localhost:3002",
		],
		credentials: true,
	})
);
app.use(cookieParser());

// ✅ Configure the Apollo Gateway for microservices
const gateway = new ApolloGateway({
	supergraphSdl: new IntrospectAndCompose({
		subgraphs: [
			{ name: "auth", url: "http://localhost:4001/graphql" },
			{ name: "gameProgress", url: "http://localhost:4002/graphql" },
		],
	}),
});

// ✅ Initialize Apollo Server
const server = new ApolloServer({
	gateway,
	introspection: true,
});

async function startServer() {
	try {
		await server.start();
		app.use(
			"/graphql",
			expressMiddleware(server, {
				context: async ({ req, res }) => ({ req, res }),
			})
		);
		app.listen(4000, () => {
			console.log(`🚀 API Gateway ready at http://localhost:4000/graphql`);
		});
	} catch (error) {
		console.error("Failed to start gateway:", error);
	}
}

startServer();
