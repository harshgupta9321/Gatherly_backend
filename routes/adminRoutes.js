import express from 'express';
import {
  getAllUsers,
  updateUserRole,
  getVenueStats,
  getAllBookings,
  getUsersByRole
} from '../controllers/adminController.js';
import auth from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Admin-only routes
router.use(auth, checkRole(['admin']));


router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.get('/venue-stats', getVenueStats);
router.get('/bookings', getAllBookings);
router.get('/users/roles', getUsersByRole);

export default router;
