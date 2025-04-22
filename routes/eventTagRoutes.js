// routes/eventTagRoutes.js
import express from 'express';
import { createTag, updateTag, deleteTag } from '../controllers/eventTagController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Admin-only routes
router.post('/', authMiddleware, checkRole(['admin']), createTag);
router.put('/:tagId', authMiddleware, checkRole(['admin']), updateTag);
router.delete('/:tagId', authMiddleware, checkRole(['admin']), deleteTag);

export default router;
