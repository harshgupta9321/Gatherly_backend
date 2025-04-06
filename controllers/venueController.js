import Venue from '../models/Venue.js';

export const addVenue = async (req, res) => {
    try {
        const { name, location, capacity, price, description, images } = req.body;
        const venue = new Venue({
            name,
            location,
            capacity,
            price,
            description,
            images,
            createdBy: req.user.userId,
        });

        await venue.save();
        res.status(201).json({ message: 'Venue added successfully', venue });
    } catch (error) {
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

        if (venue.createdBy.toString() !== req.user.userId) {
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

        if (venue.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await venue.deleteOne();
        res.status(200).json({ message: 'Venue deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
