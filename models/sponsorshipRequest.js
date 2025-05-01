import mongoose from 'mongoose';

const sponsorshipRequestSchema = new mongoose.Schema({
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sponsor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', // assuming you have an Event model
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  message: {
    type: String,
  },
  categories: {
    type: [String], // Add an array of categories in case the request relates to specific categories
    required: true, // This could be required based on your logic
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

export default mongoose.model('SponsorshipRequest', sponsorshipRequestSchema);
