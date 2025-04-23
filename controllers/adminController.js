import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Venue from '../models/Venue.js';


// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a user's role
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get venue booking stats for pie chart
export const getVenueStats = async (req, res) => {
  try {
    const totalVenues = await Venue.countDocuments();
    const bookedVenues = await Booking.distinct('venue');
    const bookedCount = bookedVenues.length;
    const remainingCount = totalVenues - bookedCount;

    res.status(200).json({
      totalVenues,
      booked: bookedCount,
      remaining: remainingCount < 0 ? 0 : remainingCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email role')
      .populate('venue', 'name location price');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get users by role (admin can select any role, including 'admin', if no role is provided show all users)
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query; // Get role from query params
    
    // Check if the role is valid and if provided
    const validRoles = ['audience', 'organizer', 'admin'];  // Include 'admin' in valid roles
    
    // If no role is provided, fetch all users
    let users;
    if (!role) {
      // No role specified, fetch all users
      users = await User.find().select('-password'); // Get all users
    } else if (validRoles.includes(role)) {
      // If role is valid, fetch users of the specified role
      users = await User.find({ role }).select('-password');
    } else {
      // Invalid role passed
      return res.status(400).json({ message: 'Invalid role specified or role not allowed' });
    }

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found for the given role or criteria' });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


