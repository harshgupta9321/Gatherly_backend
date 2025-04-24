import EventLike from '../models/EventLike.js';
import VenueLike from '../models/VenueLike.js';

export const likeEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const ipAddress = req.ip;
    const userId = req.user?.userId || null;

    const existingLike = await EventLike.findOne({ event: eventId, $or: [{ user: userId }, { ipAddress }] });
    if (existingLike) return res.status(400).json({ message: 'Already liked' });

    await EventLike.create({ event: eventId, user: userId, ipAddress });
    res.status(201).json({ message: 'Event liked' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likeVenue = async (req, res) => {
  try {
    const { venueId } = req.params;
    const ipAddress = req.ip;
    const userId = req.user?.userId || null;

    const existingLike = await VenueLike.findOne({ venue: venueId, $or: [{ user: userId }, { ipAddress }] });
    if (existingLike) return res.status(400).json({ message: 'Already liked' });

    await VenueLike.create({ venue: venueId, user: userId, ipAddress });
    res.status(201).json({ message: 'Venue liked' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventLikes = async (req, res) => {
  try {
    const { eventId } = req.params;
    const count = await EventLike.countDocuments({ event: eventId });
    res.status(200).json({ eventId, likes: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVenueLikes = async (req, res) => {
  try {
    const { venueId } = req.params;
    const count = await VenueLike.countDocuments({ venue: venueId });
    res.status(200).json({ venueId, likes: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
