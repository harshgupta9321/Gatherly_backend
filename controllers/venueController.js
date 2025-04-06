// import Venue from '../models/V'

// Create a new venue
export const createVenue = async (req, res) => {
  try {
    const venue = await Venue.create({ ...req.body, owner: req.user.id });
    res.status(201).json(venue);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating venue', error: err.message });
  }
};

// Get all approved venues
export const getApprovedVenues = async (req, res) => {
  try {
    const venues = await Venue.find({ isApproved: true });
    res.json(venues);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching venues', error: err.message });
  }
};

// Admin: Approve a venue
export const approveVenue = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });

    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ msg: 'Venue not found' });

    venue.isApproved = true;
    await venue.save();
    res.json({ msg: 'Venue approved', venue });
  } catch (err) {
    res.status(500).json({ msg: 'Error approving venue', error: err.message });
  }
};
