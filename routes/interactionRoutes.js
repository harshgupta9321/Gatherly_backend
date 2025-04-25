import express from 'express';
import {
  // likeEvent,
  likeVenue,
  getEventLikes,
  getVenueLikes,
} from '../controllers/likeController.js';

import {
  recordVenueView,
  getVenueViews,
} from '../controllers/venueViewController.js';

import { recordEventView, getEventViews } from '../controllers/eventViewController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Event interactions
router.post('/events/:eventId/view', recordEventView);
router.get('/events/:eventId/views', getEventViews);
// router.post('/events/:eventId/like', authMiddleware, likeEvent);
router.get('/events/:eventId/likes', getEventLikes);

// Venue interactions
router.post('/venues/:venueId/view', recordVenueView);
router.get('/venues/:venueId/views', getVenueViews);
router.post('/venues/:venueId/like', authMiddleware, likeVenue);
router.get('/venues/:venueId/likes', getVenueLikes);

export default router;
