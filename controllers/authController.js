import cloudinary from 'cloudinary';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {sendTemplatedEmail} from '../utils/emailUtil.js';
import RoleRequest from '../models/RoleRequest.js';
import { createNotification } from '../utils/notificationUtils.js';

// ✅ Register user & send 4-digit OTP
export const registerUser = async (req, res) => {
    console.log('🧠 Inside registerUser controller');

    const { name, email, password, role, address } = req.body;
    const avatar = req.file?.path;

    if (!name || !email || !password || !role || !address || !avatar) {
        return res.status(400).json({ message: 'All fields including avatar and address are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ message: 'User already exists' });

        // ✅ Generate 4-digit OTP (ensure leading 0s are kept)
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // ✅ Expiry: 10 minutes from now
        const otpExpires = Date.now() + 10 * 60 * 1000;

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            address,
            avatar,
            otp,
            otpExpires,
            isVerified: false
        });

        // ✅ Send OTP Email
        await sendTemplatedEmail(
          email,
          'Verify your email',
          'otpConfirmation',
          { name, otp, validity: 10 }  // pass data object for EJS template
      );
      

        res.status(200).json({ message: 'OTP sent to your email. Please verify to complete registration.' });

    } catch (err) {
        console.error('❌ Registration Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ✅ Verify OTP
export const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User already verified' });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email before logging in' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '2d',
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 2 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Logout
export const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};

// ✅ Request role upgrade
export const requestRoleUpgrade = async (req, res) => {
    try {
        const { roleRequest } = req.body;

        if (!['organizer', 'vendor', 'sponsor'].includes(roleRequest)) {
            return res.status(400).json({ message: 'Invalid role requested' });
        }

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.role !== 'audience') {
            return res.status(400).json({ message: 'Only audience can request role change' });
        }

        user.roleRequest = roleRequest;
        await user.save();

        res.status(200).json({ message: 'Role request submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Get total user count
export const getUserCount = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.status(200).json({ success: true, count });
    } catch (error) {
        console.error('Error fetching user count:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ✅ Update user profile (avatar)
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let avatarUrl = user.avatar;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            avatarUrl = result.secure_url;
        }

        user.avatar = avatarUrl;
        await user.save();

        res.status(200).json({ message: 'User profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Get logged-in user's details
export const getUserDetails = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('name email role avatar');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Update user details (name, email, phone, address, avatar)
export const updateUserDetails = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { name, email, phone, address } = req.body;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Update fields only if they are provided
      if (name) user.name = name;
      if (email) user.email = email;
      if (phone) user.phone = phone;
      if (address) user.address = address;
  
      // If avatar is updated
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        user.avatar = result.secure_url;
      }
  
      await user.save();
  
      res.status(200).json({
        message: 'User profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          avatar: user.avatar,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

// ✅ Test route
export const test = async (req, res) => {
    try {
        res.status(200).json({ message: 'API working fine' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Check logged-in user
export const getMe = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Get user's theme preference
export const getThemePreference = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ isDarkMode: user.themePreference === 'dark' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update user's theme preference
export const updateThemePreference = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { isDarkMode } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.themePreference = isDarkMode ? 'dark' : 'light';
        await user.save();

        res.status(200).json({ message: 'Theme preference updated successfully', isDarkMode });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add this new controller function
export const verifyToken = async (req, res) => {
  try {
    // If the request reaches here, it means the token is valid
    // (because it passed through the authMiddleware)
    res.status(200).json({ valid: true });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create a new role request
export const createRoleRequest = async (req, res) => {
  try {
    const { role, businessName, description, experience, contactNumber, website } = req.body;
    const userId = req.user.userId;

    // Validate required fields
    if (!role || !businessName || !description || !experience || !contactNumber) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already has a pending request
    const existingRequest = await RoleRequest.findOne({
      user: userId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending role request' });
    }

    // Create the role request
    const roleRequest = new RoleRequest({
      user: userId,
      role,
      businessName,
      description,
      experience,
      contactNumber,
      website,
      documents: req.file ? req.file.path : undefined
    });

    await roleRequest.save();

    // Create notification for admin
    await createNotification(
      userId,
      'New Role Request',
      `Your request to become a ${role} has been submitted and is pending review`,
      'ROLE_REQUEST',
      roleRequest._id
    );

    res.status(201).json({
      message: 'Role request submitted successfully',
      request: roleRequest
    });
  } catch (error) {
    console.error('Error creating role request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


