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
