import mongoose from 'mongoose';

const venueLikeSchema = new mongoose.Schema({
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ipAddress: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('VenueLike', venueLikeSchema);
