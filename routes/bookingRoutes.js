import express from 'express';
import {
  initiateVenueBooking,
  confirmVenueBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  getBookedDatesForVenue
} from '../controllers/bookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Step 1: Create Stripe payment session
router.post('/bookings/create-session', authMiddleware, checkRole(['organizer', 'admin']), initiateVenueBooking);

// Step 2: Confirm booking after payment
router.post('/bookings/confirm', authMiddleware, confirmVenueBooking);

// Other routes
router.get('/bookings/my', authMiddleware, getUserBookings);
router.get('/bookings', authMiddleware, checkRole(['admin']), getAllBookings);
router.patch('/bookings/:id/status', authMiddleware, checkRole(['admin']), updateBookingStatus);
router.get('/bookings/:venueId/booked-dates', authMiddleware, getBookedDatesForVenue);

export default router;
