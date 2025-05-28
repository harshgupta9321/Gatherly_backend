import express from 'express';
import {
  getAllUsers,
  updateUserRole,
  getVenueStats,
  getAllBookings,
  getUsersByRole,
  getRoleRequests,
  approveRoleRequest,
  updateRoleRequest,
  createTestRoleRequest,
  getAdminNotifications,
  markNotificationAsRead
} from '../controllers/adminController.js';

import auth from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Admin-only routes
router.use(auth, checkRole(['admin']));

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/users/role/:role', getUsersByRole);

// Role request management
router.get('/role-requests', getRoleRequests);
router.put('/role-requests/:id', updateRoleRequest);
router.put('/approve-role/:id', approveRoleRequest);
router.post('/test-role-request', createTestRoleRequest);

// Notification management
router.get('/notifications', getAdminNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);

// Venue and booking management
router.get('/venue-stats', getVenueStats);
router.get('/bookings', getAllBookings);

export default router;
