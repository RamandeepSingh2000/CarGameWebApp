// server/microservices/auth-service/models/User.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const gameProgressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    level: { type: Number, required: true, default: 1 },
    experiencePoints: { type: Number, required: true, default: 0 },
    score: { type: Number, required: true, default: 0 },
    rank: { type: Number, required: false },
    achievements: [{ type: String, required: false, default: [] }],
    progress: { type: String, required: false, default: "Not started" },
    lastPlayed: {type:Date, required:false, default:Date.now}    
  },
  { timestamps: true }
);

export default mongoose.model("GameProgress", gameProgressSchema);
