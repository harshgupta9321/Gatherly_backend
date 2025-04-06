import express from 'express';
import { addBooking, getBookings } from '../controllers/bookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/', authMiddleware, addBooking);
router.get('/', authMiddleware, getBookings);

export default router;
