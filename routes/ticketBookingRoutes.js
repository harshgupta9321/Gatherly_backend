// routes/ticketBookingRoutes.js
import express from 'express';
import { createTicketBooking ,getMyBookedEvents} from '../controllers/ticketBookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';
import { initiateStripeCheckout } from '../controllers/ticketBookingController.js';

const router = express.Router();

router.post('/', authMiddleware, createTicketBooking);
router.post('/checkout', authMiddleware, initiateStripeCheckout);
router.get('/my-booked-events', authMiddleware, getMyBookedEvents);


export default router;
