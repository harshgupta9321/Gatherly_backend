import express from 'express';
import {
    register,
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
const router = express.Router();

// import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

<<<<<<< HEAD
dotenv.config(); // Load environment variables

const app = express();
const port = 5000;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avatars', // Folder name where images will be stored
    allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed image formats
    transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optional image transformations
  },
});

// Multer upload middleware
const upload = multer({ storage });

// Sample registration route with avatar upload
router.post("/register", (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({ message: "Image upload failed." });
    }
    next(); // Proceed to registerUser
  });
}, register);

// For registering with avatar
=======
// Use the upload middleware to handle file upload in routes


router.get('/me', getMe);

router.post('/register', upload.single('avatar'), register);  // For registering with avatar
>>>>>>> b06955f4c3991e1a5e013ba926628d1b3b658a53
router.put('/api/users/update-profile', upload.single('avatar'), updateUserProfile);  // For updating profile avatar
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
