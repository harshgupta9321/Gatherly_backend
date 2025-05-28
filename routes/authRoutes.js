import express from 'express';
import {
    registerUser,
    login,
    logout,
    test,
    getUserCount,
    requestRoleUpgrade,
    updateUserProfile,
    verifyEmail,
    getUserDetails,
    getThemePreference,
    updateThemePreference,
    verifyToken,
    createRoleRequest,
    updateUserDetails
} from '../controllers/authController.js';
// import  upload  from '../middleware/upload.js';  // Assuming the multer setup is in this file
import authMiddleware from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';
import { getMe } from '../controllers/authController.js';
import upload from '../config/multer.js';

const router = express.Router();

// Public routes
router.post('/register', upload.single('avatar'), registerUser);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);
router.get('/verify-token', verifyToken);

// Protected routes
router.use(authMiddleware);
router.get('/me', getMe);
router.get('/user-count', getUserCount);
router.get('/user/:id', getUserDetails);
router.put('/profile', upload.single('avatar'), updateUserProfile);
router.put('/update-details', authMiddleware, upload.single('avatar'), updateUserDetails);
router.post('/role-request', upload.single('documents'), createRoleRequest);
router.get('/theme', getThemePreference);
router.put('/theme', updateThemePreference);

export default router;
