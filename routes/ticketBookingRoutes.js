import express from 'express';
import {
  initiateTicketBooking,
  confirmTicketBooking,
  getMyBookedEvents,
  renderQRCode
} from '../controllers/ticketBookingController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Create Stripe Checkout Session for Tickets
router.post('/create-session', authMiddleware, initiateTicketBooking);

// 2. After payment success, confirm ticket booking
router.post('/confirm', authMiddleware, confirmTicketBooking);

// 3. Get My Booked Events
router.get('/my-booked-events', authMiddleware, getMyBookedEvents);


router.get('/qr/:bookingId', renderQRCode);


export default router;
