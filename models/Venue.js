
import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    images: [{ type: String }], // Array of image URLs
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Owner
}, { timestamps: true });

const Venue = mongoose.model('Venue', venueSchema);
export default Venue;
