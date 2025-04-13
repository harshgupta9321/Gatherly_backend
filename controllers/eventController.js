// controllers/eventController.js
import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
    try {
      const event = new Event({
        ...req.body,
        createdBy: req.user.userId, // This line is critical
      });
  
      await event.save();
      res.status(201).json(event);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  


  export const getAllEvents = async (req, res) => {
    try {
      const { category, location, search } = req.query;
  
      const filters = {};
      if (category) filters.category = category;
      if (location) filters.location = location;
      if (search) filters.title = { $regex: search, $options: 'i' };
  
      console.log("Filters:", filters);
  
      const events = await Event.find(filters).sort({ date: 1 });
      console.log("Found events:", events.length);
  
      res.json(events);
    } catch (err) {
      console.error("Error fetching events:", err.message);
      res.status(500).json({ error: err.message });
    }
  };
  



export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
