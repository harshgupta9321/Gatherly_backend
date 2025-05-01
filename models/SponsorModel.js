import mongoose from 'mongoose';

const sponsorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  company: { type: String, required: true },
  category: [{ type: String, required: true }], // Changed to array of strings
  criteria: { type: String },  // optional
  phone: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Sponsor', sponsorSchema);
