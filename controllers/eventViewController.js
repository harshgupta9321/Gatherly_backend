// controllers/eventViewController.js
import EventView from '../models/EventView.js';
import Event from '../models/Event.js';

export const recordEventView = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const userId = req.user ? req.user.userId : null;

    const view = new EventView({
      event: eventId,
      user: userId,
    });

    await view.save();

    res.status(200).json({ message: 'View recorded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Optional: get views count for a single event
export const getEventViews = async (req, res) => {
  try {
    const { eventId } = req.params;

    const viewsCount = await EventView.countDocuments({ event: eventId });

    res.status(200).json({ eventId, viewsCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
