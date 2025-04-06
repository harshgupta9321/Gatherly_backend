import express from 'express';
import {
  createVenue,
  getApprovedVenues,
  approveVenue,
} from '../controllers/venueController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createVenue);
router.get('/', getApprovedVenues);
router.put('/approve/:id', protect, approveVenue);

export default router;
