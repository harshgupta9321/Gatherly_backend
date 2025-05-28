import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['ROLE_REQUEST', 'ROLE_APPROVED', 'ROLE_REJECTED', 'GENERAL','BOOKING'],
    default: 'GENERAL'
  },
  read: {
    type: Boolean,
    default: false
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoleRequest',
    required: false
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

export default mongoose.model('Notification', notificationSchema); 