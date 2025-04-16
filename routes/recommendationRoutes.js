// routes/recommendationRoutes.js
import express from 'express';
import { recommendEvents } from '../controllers/recommendationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, recommendEvents);

export default router;
