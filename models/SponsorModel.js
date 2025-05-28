import mongoose from 'mongoose';

const sponsorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  experience: { type: String, required: true },
  category: [{ type: String }], // Made optional
  criteria: { type: String },  // optional
  phone: { type: String }, // Made optional
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isTemporary: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Sponsor', sponsorSchema);
