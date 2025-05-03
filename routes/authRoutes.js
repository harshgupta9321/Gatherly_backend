import express from 'express';
import {
    registerUser,
    login,
    logout,
    test,
    getUserCount,
    requestRoleUpgrade ,
    updateUserProfile,
    verifyEmail,
    getUserDetails
} from '../controllers/authController.js';
// import  upload  from '../middleware/upload.js';  // Assuming the multer setup is in this file
import authMiddleware from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';
import { getMe } from '../controllers/authController.js';
import upload from '../config/multer.js';

const router = express.Router();


router.post('/register', upload.single('avatar'), registerUser);
router.post('/verify-email', verifyEmail);  
router.get('/me', getMe);
router.get('/user/details', authMiddleware, getUserDetails);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user-count', getUserCount);
router.get('/test', test);

// Role request by user (audience -> organizer/vendor)
router.post('/request-role', authMiddleware, requestRoleUpgrade); // ✅ New route


export default router;
