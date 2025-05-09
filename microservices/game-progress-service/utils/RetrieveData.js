import GameHint from "../models/GameHint.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
//
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate embedding using Gemini
const generateEmbedding = async (text) => {
  try {
    const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
    const embeddingResponse = await embeddingModel.embedContent({
      content: {
        parts: [{ text }],
        role: "user",
      },
    });

    if (!embeddingResponse.embedding) throw new Error("No embedding generated");
    return embeddingResponse.embedding.values;
  } catch (error) {
    console.error("Error generating embeddings with Gemini:", error);
    throw new Error("Failed to generate embedding");
  }
};

// Retrieve relevant discussions using vector similarity
export const retrieveData = async (query) => {
  const queryEmbedding = await generateEmbedding(query);
  const allHints = await GameHint.find({
    embedding: { $exists: true, $ne: [] },
  });

  const rankedHints = allHints
    .map((hint) => ({
      hint,
      similarity: cosineSimilarity(queryEmbedding, hint.embedding),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);

  return rankedHints.map((h) => h.hint.content);
};

const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val ** 2, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val ** 2, 0));

  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
};
