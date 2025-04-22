// routes/eventViewRoutes.js
import express from 'express';
import { recordEventView, getEventViews } from '../controllers/eventViewController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:eventId/view', authMiddleware, recordEventView);
router.get('/:eventId/views', getEventViews);

export default router;
