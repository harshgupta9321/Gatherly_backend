import EventLike from '../models/EventLike.js';
import VenueLike from '../models/VenueLike.js';
import Event from '../models/Event.js';

export const toggleLike = async (req, res) => {
  try {
    const { eventId } = req.params;
    const ipAddress = req.ip;
    const userId = req.user?.userId || null;

    const existingLike = await EventLike.findOne({
      event: eventId,
      $or: [{ user: userId }, { ipAddress }],
    });

    if (existingLike) {
      await EventLike.findByIdAndDelete(existingLike._id);
      return res.status(200).json({ message: 'Event unliked' });
    }

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

// export const getEventLikes = async (req, res) => {
//   try {
//     const { eventId } = req.params;
//     const count = await EventLike.countDocuments({ event: eventId });
//     res.status(200).json({ eventId, likes: count });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getEventLikes = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('category tags sponsors') // optional
      .lean(); // Convert to plain JS object

    const eventsWithLikes = await Promise.all(events.map(async (event) => {
      const likesCount = await EventLike.countDocuments({ event: event._id });

      return {
        ...event,
        likes: likesCount,
      };
    }));

    res.status(200).json(eventsWithLikes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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
