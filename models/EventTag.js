// models/EventTag.js
import mongoose from 'mongoose';

const eventTagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('EventTag', eventTagSchema);
