import express from 'express';
import { 
  addOrUpdateSponsorDetails, 
  requestSponsorship, 
  getAllSponsors,
  createSponsorshipRequest, 
  getSponsorshipRequests, 
  updateSponsorshipRequestStatus 
} from '../controllers/sponsorController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import {checkRole} from '../middleware/checkRole.js'; // Assuming checkRole is defined in your middleware

const router = express.Router();

// Sponsor routes
router.post('/details', authMiddleware, checkRole('sponsor'), addOrUpdateSponsorDetails);  // Sponsor adds or updates details
router.get('/', authMiddleware, getAllSponsors);                     // View all sponsors

// Organizer routes
router.post('/request', authMiddleware, checkRole('organizer'), requestSponsorship);         // Organizer requests sponsorship

// Sponsorship Request routes
router.post('/sponsorship-request', authMiddleware, checkRole('organizer'), createSponsorshipRequest); // Organizer sends a sponsorship request
router.get('/sponsorship-requests', authMiddleware, checkRole('sponsor'), getSponsorshipRequests);  // Sponsor views their requests
router.put('/sponsorship-request/:id', authMiddleware, checkRole('sponsor'), updateSponsorshipRequestStatus);  // Sponsor updates request status

export default router;
