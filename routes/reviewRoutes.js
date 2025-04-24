// routes/reviewRoutes.js
import express from 'express';
import { addReview, getReviews } from '../controllers/reviewController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', auth, addReview);
router.get('/', getReviews);

export default router;
