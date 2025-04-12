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

router.post('/venues', authMiddleware, checkRole(['admin', 'organizer']), addVenue);
router.get('/venues', getVenues);
router.get('/venues/:id', getVenueById);
router.put('/venues/:id', authMiddleware, checkRole(['admin', 'organizer']), updateVenue);
router.delete('/venues/:id', authMiddleware, checkRole(['admin', 'organizer']), deleteVenue);

export default router;
