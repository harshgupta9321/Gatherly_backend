// controllers/eventController.js
import Event from '../models/Event.js';
import cloudinary from 'cloudinary'

export const createEvent = async (req, res) => {
  try {
    // Make sure the user is authenticated and has a valid token
    const userId = req.user.userId; // Assuming you use a middleware to set the userId in req.user
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { title, description, date, time, location, ticketsAvailable, ticketPrice } = req.body;

    // Handle image upload
    let imageUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;  // The URL of the uploaded image from Cloudinary
    }

    // Create a new event with the authenticated user's ID as the 'createdBy' field
    const newEvent = new Event({
      title,
      description,
      date,
      time,
      location,
      ticketsAvailable,
      ticketPrice,
      image: imageUrl,  // Use the image URL returned by Cloudinary
      createdBy: userId, // This is where you use the authenticated user's ID
    });

    // Save the event to the database
    await newEvent.save();
    
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
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

export const getMyEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const events = await Event.find({ organizer: userId });
    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// ------------------------------
// event views section 
// controllers/eventController.js
export const incrementView = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Increment the view count by adding the user's view
    event.views.push(req.user.userId);  // Assuming userId is provided in req.user from auth middleware
    await event.save();
    res.status(200).json({ message: 'View incremented successfully', views: event.views.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const incrementLike = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Increment the like count
    event.likes += 1;
    await event.save();
    res.status(200).json({ message: 'Like incremented successfully', likes: event.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
