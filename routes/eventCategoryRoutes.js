// routes/eventCategoryRoutes.js
import express from 'express';
import { createCategory, updateCategory, deleteCategory } from '../controllers/eventCategoryController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Admin-only routes
router.post('/', authMiddleware, checkRole(['admin']), createCategory);
router.put('/:categoryId', authMiddleware, checkRole(['admin']), updateCategory);
router.delete('/:categoryId', authMiddleware, checkRole(['admin']), deleteCategory);

export default router;
