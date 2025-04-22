import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/create', authMiddleware, checkRole(['organizer', 'admin']),upload.single('image'), createEvent);
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.put('/:id', authMiddleware, checkRole(['organizer', 'admin']), updateEvent);
router.delete('/:id', authMiddleware, checkRole(['organizer', 'admin']), deleteEvent);

export default router;
