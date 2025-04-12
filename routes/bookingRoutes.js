import express from 'express';
import {
    createBooking,
    getUserBookings,
    getAllBookings,
    updateBookingStatus
} from '../controllers/bookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Audience can book
router.post('/bookings', authMiddleware, checkRole(['audience', 'admin']), createBooking);

// Logged-in user can view their own bookings
router.get('/bookings/my', authMiddleware, getUserBookings);

// Admin can see all bookings
router.get('/bookings', authMiddleware, checkRole(['admin']), getAllBookings);

// Admin can update booking status
router.patch('/bookings/:id/status', authMiddleware, checkRole(['admin']), updateBookingStatus);

export default router;
