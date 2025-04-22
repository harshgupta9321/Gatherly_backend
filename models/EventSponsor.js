// models/EventSponsor.js
import mongoose from 'mongoose';

const eventSponsorSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  sponsorName: { type: String, required: true },
  sponsorLogo: { type: String },  // Image URL
  website: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('EventSponsor', eventSponsorSchema);
