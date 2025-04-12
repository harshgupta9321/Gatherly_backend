// models/Event.js
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: {
    type: String,
    enum: ['Conference', 'Concert', 'Workshop', 'Meetup'],
    required: true,
  },
  date: { type: Date, required: true },
  time: String,
  location: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ticketsAvailable: { type: Number, default: 0 },
  ticketPrice: { type: Number, default: 0 },
  image: String,
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
