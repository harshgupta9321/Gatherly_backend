import mongoose from 'mongoose';

const eventLikeSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ipAddress: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('EventLike', eventLikeSchema);
