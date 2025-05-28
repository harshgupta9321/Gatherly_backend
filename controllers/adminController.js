import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Venue from '../models/Venue.js';
import RoleRequest from '../models/RoleRequest.js';
import Notification from '../models/Notification.js';
import { createNotification } from '../utils/notificationUtils.js';


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
    const validRoles = ['audience', 'organizer', 'admin','vendor'];  // Include 'admin' in valid roles
    
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

// Get all users with role requests
export const getRoleRequests = async (req, res) => {
  try {
    console.log('Fetching role requests...');
    const requests = await RoleRequest.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    console.log('Found role requests:', requests);
    
    if (!requests || requests.length === 0) {
      console.log('No role requests found');
      return res.status(200).json([]); // Return empty array instead of error
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error in getRoleRequests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update role request status
export const updateRoleRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await RoleRequest.findById(id).populate('user');
    if (!request) {
      return res.status(404).json({ message: 'Role request not found' });
    }

    request.status = status;
    await request.save();

    // If request is approved, update user's role
    if (status === 'approved') {
      const user = await User.findById(request.user._id);
      if (user) {
        user.role = request.role;
        await user.save();
      }
    }

    // Create notification
    await createNotification(
      request.user._id,
      `Role Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      `Your request to become a ${request.role} has been ${status}`,
      'ROLE_REQUEST',
      request._id
    );

    res.status(200).json({ message: 'Role request updated', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve role request (legacy support)
export const approveRoleRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await RoleRequest.findById(id).populate('user');
    if (!request) {
      return res.status(404).json({ message: 'Role request not found' });
    }

    request.status = 'approved';
    await request.save();

    // Update user's role
    const user = await User.findById(request.user._id);
    if (user) {
      user.role = request.role;
      await user.save();
    }

    // Create notification
    await createNotification(
      request.user._id,
      'Role Request Approved',
      `Your request to become a ${request.role} has been approved`,
      'ROLE_APPROVED',
      request._id
    );

    res.status(200).json({ message: 'Role request approved', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a test role request (for debugging purposes)
export const createTestRoleRequest = async (req, res) => {
  try {
    const testRequest = new RoleRequest({
      user: req.user.userId, // Use the admin's ID for testing
      role: 'sponsor',
      businessName: 'Test Business',
      description: 'Test Description',
      experience: '5 years',
      contactNumber: '1234567890',
      website: 'http://test.com',
      status: 'pending'
    });

    await testRequest.save();
    console.log('Created test role request:', testRequest);

    res.status(201).json({
      message: 'Test role request created',
      request: testRequest
    });
  } catch (error) {
    console.error('Error creating test role request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all admin notifications
export const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('requestId');
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this notification' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

