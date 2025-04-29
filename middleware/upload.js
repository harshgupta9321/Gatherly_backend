import multer from 'multer';
import { storage } from '../utils/cloudinary.js';  // Correct import from utils/cloudinary.js

const upload = multer({ storage });

export default upload;
