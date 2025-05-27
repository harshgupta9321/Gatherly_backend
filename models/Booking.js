import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    bookedAt: {
        type: Date,
        default: Date.now,
      },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
