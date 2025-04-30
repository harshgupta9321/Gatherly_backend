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
    default: 1,
    min: 1,
    max: 1, // Optional strict enforcement
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
  qrCode: {
    type: String, // base64 or cloudinary url
  },
  
});

export default mongoose.model('TicketBooking', ticketBookingSchema);
