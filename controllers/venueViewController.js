import VenueView from '../models/VenueView.js';
import Venue from '../models/Venue.js';

export const recordVenueView = async (req, res) => {
  try {
    const { venueId } = req.params;

    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });

    const ipAddress = req.ip;
    const userId = req.user?.userId || null;

    await VenueView.create({ venue: venueId, user: userId, ipAddress });
    res.status(200).json({ message: 'View recorded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVenueViews = async (req, res) => {
  try {
    const { venueId } = req.params;

    const views = await VenueView.countDocuments({ venue: venueId });
    res.status(200).json({ venueId, viewsCount: views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
