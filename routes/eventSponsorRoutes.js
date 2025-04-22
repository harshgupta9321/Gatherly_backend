// routes/eventSponsorRoutes.js
import express from 'express';
import { addSponsor } from '../controllers/eventSponsorController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Organizers and Admins can add sponsors
router.post('/', authMiddleware, checkRole(['admin', 'organizer']), addSponsor);

export default router;
