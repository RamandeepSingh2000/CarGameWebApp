// Load environment variables
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import mongoose from "mongoose";
import { TextLoader } from "langchain/document_loaders/fs/text";
import GameHint from "./models/GameHint.js";
import { generateEmbedding } from "./utils/embedding.js";

// Debug: Check environment variables
console.log("Mongo URI:", process.env.SERVICE_MONGO_URI);
console.log("Gemini API Key:", process.env.GEMINI_API_KEY);

const seedHints = async () => {
  try {
    // Connect to MongoDB
    if (!process.env.SERVICE_MONGO_URI) {
      throw new Error("SERVICE_MONGO_URI is not defined in .env");
    }
    await mongoose.connect(process.env.SERVICE_MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Load hints from file
    const loader = new TextLoader("./data/hints.txt");
    const docs = await loader.load();

    for (const doc of docs) {
      const sentences = doc.pageContent
        .split(/\r?\n/)
        .filter((line) => line.trim());

      for (let i = 0; i < sentences.length; i += 3) {
        const combinedSentences = sentences.slice(i, i + 3).join(" ");
        const embedding = await generateEmbedding(combinedSentences);
        const hint = new GameHint({
          category: sentences[i].replace(/^Category:\s*/, "").trim(),
          level: parseInt(sentences[i + 1].replace(/^Level:\s*/, "").trim(), 10),
          content: sentences[i + 2].replace(/^Content:\s*/, "").trim(),
          embedding,
        });
        await hint.save();
        console.log(`Saved hint: ${hint.content}`);
      }
    }
    console.log("✅ Seeded game hints!");
  } catch (error) {
    console.error("❌ Error seeding hints:", error.message);
  } finally {
    mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

seedHints();