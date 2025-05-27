// controllers/eventController.js
import Event from '../models/Event.js';
import cloudinary from 'cloudinary';
import EventLike from '../models/EventLike.js';
import EventView from '../models/EventView.js';
import ticketBooking from '../models/TicketBooking.js'



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
  
      const events = await Event.aggregate([
        { $match: filters },
        {
          $lookup: {
            from: 'eventlikes', // Lookup to count likes
            localField: '_id',
            foreignField: 'event',
            as: 'likeDocs'
          }
        },
        {
          $addFields: {
            likeCount: { $size: '$likeDocs' } // Add like count field
          }
        },
        {
          $lookup: {
            from: 'eventviews', // Lookup to count views
            localField: '_id',
            foreignField: 'event',
            as: 'viewDocs'
          }
        },
        {
          $addFields: {
            viewCount: { $size: '$viewDocs' } // Add view count field
          }
        },
        {
          $project: {
            likeDocs: 0,
            viewDocs: 0 // Exclude the likeDocs and viewDocs arrays from the result
          }
        },
        { $sort: { date: 1 } } // Sort by date (ascending)
      ]);
  
      res.json(events); // Return events with like and view counts
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
    const events = await Event.find({ createdBy: userId });
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




// like function
export const toggleLike = async (req, res) => {
  try {
    const { eventId } = req.params;
    const ipAddress = req.ip;
    const userId = req.user?.userId || null;

    const existingLike = await EventLike.findOne({
      event: eventId,
      $or: [{ user: userId }],
    });

    if (existingLike) {
      await EventLike.findByIdAndDelete(existingLike._id);
      return res.status(200).json({ message: 'Event unliked', color:true });
    }

    await EventLike.create({ event: eventId, user: userId, ipAddress });
    res.status(201).json({ message: 'Event liked',color:false });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// event views section 
export const incrementView = async (req, res) => {
  try {
    const { eventId } = req.params; // Get eventId from the URL params

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Get the userId if the user is logged in, otherwise use IP address for anonymous views
    const userId = req.user ? req.user.userId : null;
    const ipAddress = req.ip; // For anonymous users

    // Check if the view already exists for this user/IP and event
    const existingView = await EventView.findOne({
      event: eventId,
      $or: [{ user: userId }, { ipAddress }],
    });

    if (existingView) {
      // If the user has already viewed the event, don't count the view again
      return res.status(200).json({ message: 'View already recorded' });
    }

    // Create a new view record for this event
  const view = new EventView({
      event: eventId,
      user: userId, // This will be null for anonymous users
      ipAddress,    // For anonymous users, we track the IP
    });

    await view.save(); // Save the view record to the database

    // Return a success response
    res.status(200).json({ message: 'View recorded' });

  } catch (error) {
    // Catch any errors and return an internal server error message
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

// @desc    Get all users enrolled in a specific event
// @route   GET /api/events/:eventId/enrolled-users
// @access  Organizer only
export const getEnrolledUsersForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
   
    // Check if the requester is the organizer of this event
    if (event.createdBy.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Access denied: Not the organizer of this event' });
    }

    // Find all bookings for this event
    const bookings = await ticketBooking.find({ event: eventId }).populate('user', 'name email avatar');

    // Map enrolled users' info
    const enrolledUsers = bookings.map((booking) => ({
      name: booking.user.name,
      email: booking.user.email,
      avatar: booking.user.avatar,
    }));

    res.status(200).json({ enrolledUsers });
  } catch (error) {
    console.error('Error fetching enrolled users:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
