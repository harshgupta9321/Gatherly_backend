// models/Review.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue'
  }
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
