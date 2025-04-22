// // routes/eventReviewRoutes.js
// import express from 'express';
// import { addReview } from '../controllers/eventReviewController.js';
// import authMiddleware from '../middleware/authMiddleware.js';
// import { checkRole } from '../middleware/checkRole.js';

// const router = express.Router();

// // Only attendees can submit reviews
// router.post('/', authMiddleware, checkRole(['attendee']), addReview);

// export default router;
