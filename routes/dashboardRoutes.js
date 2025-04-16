// routes/dashboardRoutes.js
import express from 'express';
import { getAdminDashboardData, getOrganizerDashboardData, getUserDashboardData, getAdminAnalytics } from '../controllers/dashboardController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Admin dashboard
router.get('/admin', authMiddleware, checkRole(['admin']), getAdminDashboardData);

// Organizer dashboard
router.get('/organizer', authMiddleware, checkRole(['organizer']), getOrganizerDashboardData);


// User dashboard
router.get('/user', authMiddleware, checkRole(['audience']), getUserDashboardData);

//Analytics
router.get('/admin/analytics', authMiddleware, checkRole(['admin']), getAdminAnalytics);



export default router;
