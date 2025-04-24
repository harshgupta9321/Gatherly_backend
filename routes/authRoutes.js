import express from 'express';
import {
    register,
    login,
    logout,
    test,
    updateUserRole,
    getUserCount,
    requestRoleUpgrade 
} from '../controllers/authController.js';

import authMiddleware from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user-count', getUserCount);
router.get('/test', test);

// Role request by user (audience -> organizer/vendor)
router.post('/request-role', authMiddleware, requestRoleUpgrade); // ✅ New route

// Admin Only Route to update a user's role
router.patch(
    '/role/:id',
    authMiddleware,
    checkRole(['admin']),
    updateUserRole
);

router.get('/admin-test', authMiddleware, checkRole(['admin']), (req, res) => {
    res.send('Hello Admin');
});

export default router;
