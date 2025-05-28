import express from 'express';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../controllers/notificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all notifications for the authenticated user
router.get('/', authMiddleware, getUserNotifications);

// Mark a specific notification as read
router.put('/:id/read', authMiddleware, markNotificationAsRead);

// Mark all notifications as read
router.put('/read-all', authMiddleware, markAllNotificationsAsRead);

export default router; 