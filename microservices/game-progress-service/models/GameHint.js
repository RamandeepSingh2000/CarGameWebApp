import mongoose from 'mongoose';

const GameHintSchema = new mongoose.Schema({
  category: { type: String, required: true, enum: ['General', 'Strategy', 'Critical Strategy', 'Achievement'] },
  level: { type: Number },
  content: { type: String, required: true },
  embedding: { type: [Number] }
});

export default mongoose.model('GameHint', GameHintSchema);