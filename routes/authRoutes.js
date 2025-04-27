import express from 'express';
import {
    register,
    login,
    logout,
    test,
    updateUserRole,
    getUserCount,
    requestRoleUpgrade ,
    updateUserProfile
} from '../controllers/authController.js';
import  upload  from '../middleware/upload.js';  // Assuming the multer setup is in this file
import authMiddleware from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Public Routes
// router.post('/register', register);

// Use the upload middleware to handle file upload in routes
router.post('/api/register', upload.single('avatar'), register);  // For registering with avatar
router.put('/api/users/update-profile', upload.single('avatar'), updateUserProfile);  // For updating profile avatar

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
