import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  phone: { type: String },
  address: { type: String },  // ✅ added address
  role: {
      type: String,
      enum: ['admin', 'organizer', 'audience', 'vendor', 'sponsor'],
      default: 'audience'
  },
  roleRequest: {
      type: String,
      enum: ['organizer', 'vendor', 'sponsor', null],
      default: null
  },
  isVerified: {
      type: Boolean,
      default: false  // ✅ email verification status
  },
  otp: { type: String },
  otpExpires: { type: Date },
  themePreference: {
      type: String,
      enum: ['light', 'dark'],
      default: 'dark'
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
