import mongoose from 'mongoose';

const ticketBookingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tickets: {
    type: Number,
    required: true,
    min: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled', 'Refunded'],
    default: 'Confirmed',
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('TicketBooking', ticketBookingSchema);
