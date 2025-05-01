import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  phone: { type: String }, // You may want to store sponsor phone numbers here too
  role: {
    type: String,
    enum: ['admin', 'organizer', 'audience', 'vendor', 'sponsor'],  // 👈 added sponsor
    default: 'audience'  // 👈 default audience
  },
  roleRequest: {
    type: String,
    enum: ['organizer', 'vendor', 'sponsor', null],  // 👈 added sponsor
    default: null
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
