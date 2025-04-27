// models/Event.js
import mongoose from 'mongoose';

// const eventSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   category: {
//     type: String,
//     enum: ['Conference', 'Concert', 'Workshop', 'Meetup'],
//     required: true,
//   },
//   date: { type: Date, required: true },
//   time: String,
//   location: String,
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   ticketsAvailable: { type: Number, default: 0 },
//   ticketPrice: { type: Number, default: 0 },
//   image: String,
// }, { timestamps: true });

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  time: String,
  location: String,
  image: String,

  // Ticketing
  ticketsAvailable: { type: Number, default: 0 },
  ticketPrice: { type: Number, default: 0 },

  // Ownership
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // NEW FIELDS
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'EventCategory' },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EventTag' }],
  sponsors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EventSponsor' }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EventReview' }],
  views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EventView' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EventLike' }],
  // likes: { type: Number, default: 0 },

}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
