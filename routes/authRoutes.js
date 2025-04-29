import express from 'express';
import {
    registerUser,
    login,
    logout,
    test,
    updateUserRole,
    getUserCount,
    requestRoleUpgrade ,
    updateUserProfile,
    getUserDetails
} from '../controllers/authController.js';
// import  upload  from '../middleware/upload.js';  // Assuming the multer setup is in this file
import authMiddleware from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';
import { getMe } from '../controllers/authController.js';
import upload from '../config/multer.js';

const router = express.Router();

import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

router.post('/register', upload.single('avatar'), registerUser);
router.get('/me', getMe);
router.get('/user/details', authMiddleware, getUserDetails);
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
