import express from 'express';
import {
    register,
    login,
    logout,
    test,
    updateUserRole,
} from '../controllers/authController.js';

import authMiddleware from '../middleware/authMiddleware.js';
import {checkRole} from '../middleware/checkRole.js';

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/test', test);

// Admin Only Route to update a user's role
router.patch(
    '/role/:id',
    authMiddleware,         // must be authenticated
    checkRole(['admin']),   // must be admin
    updateUserRole
);

router.get('/admin-test', authMiddleware, checkRole(['admin']), (req, res) => {
    res.send('Hello Admin');
  });
  

export default router;
