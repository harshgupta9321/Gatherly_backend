// models/EventCategory.js
import mongoose from 'mongoose';

const eventCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('EventCategory', eventCategorySchema);
