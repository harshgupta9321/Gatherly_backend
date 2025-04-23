import Venue from '../models/Venue.js';
import cloudinary from 'cloudinary';

// Set up Cloudinary configuration (in a separate utils/cloudinary.js or directly in your controller)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const addVenue = async (req, res) => {
  try {
    const { name, location, capacity, price, description } = req.body;
    
    // Check if there are any images uploaded
    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.v2.uploader.upload(file.path); // Upload file to Cloudinary
        images.push(result.secure_url); // Store Cloudinary image URL
      }
    }

    // Create the venue with uploaded image URLs
    const venue = new Venue({
      name,
      location,
      capacity,
      price,
      description,
      images,  // Array of image URLs from Cloudinary
      createdBy: req.user.userId,
    });

    await venue.save();
    res.status(201).json({ message: 'Venue added successfully', venue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};


export const getVenues = async (req, res) => {
    try {
        const venues = await Venue.find().populate('createdBy', 'name email');
        res.status(200).json(venues);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getVenueById = async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id).populate('createdBy', 'name email');
        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }
        res.status(200).json(venue);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateVenue = async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }

        if (req.user.role !== 'admin' && venue.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        Object.assign(venue, req.body);
        await venue.save();

        res.status(200).json({ message: 'Venue updated successfully', venue });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteVenue = async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }

        if (req.user.role !== 'admin' && venue.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await venue.deleteOne();
        res.status(200).json({ message: 'Venue deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
