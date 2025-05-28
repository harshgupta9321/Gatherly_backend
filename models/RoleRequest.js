import mongoose from 'mongoose';

const roleRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['sponsor', 'vendor', 'organizer'],
    required: true
  },
  businessName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  documents: {
    type: String // URL to uploaded documents
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

// Add indexes for better query performance
roleRequestSchema.index({ user: 1, status: 1 });
roleRequestSchema.index({ createdAt: -1 });

// Add a method to check for pending requests
roleRequestSchema.statics.hasPendingRequest = async function(userId) {
  return await this.exists({
    user: userId,
    status: 'pending'
  });
};

export default mongoose.model('RoleRequest', roleRequestSchema); 