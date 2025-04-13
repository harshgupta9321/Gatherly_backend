import express from 'express';
import {
    addVenue,
    getVenues,
    getVenueById,
    updateVenue,
    deleteVenue,
} from '../controllers/venueController.js';

import authMiddleware from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

router.post('/', authMiddleware, addVenue); // Create venue
router.get('/', getVenues); // Get all venues
router.get('/:id', getVenueById); // Get a single venue
router.put('/:id', authMiddleware, updateVenue); // Update venue
router.delete('/:id', authMiddleware, deleteVenue); // Delete venue

export default router;
