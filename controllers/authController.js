import cloudinary from 'cloudinary';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
// This must come FIRST, before cloudinary config

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Register (assign default role: 'audience')
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    console.log(process.env.CLOUDINARY_CLOUD_NAME);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle avatar image upload (if exists)
    let avatarUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);  // Upload the image to Cloudinary
      avatarUrl = result.secure_url;  // Get the URL of the uploaded image
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'audience', // 👈 Set default role here
      avatar: avatarUrl,  // Save the avatar URL in the User document
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// ✅ Register (assign default role: 'audience')
// export const register = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         const userExists = await User.findOne({ email });
//         if (userExists) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const newUser = new User({
//             name,
//             email,
//             password: hashedPassword,
//             role: 'audience', // 👈 Set default role here
//         });

//         await newUser.save();

//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// ✅ Login (safe, reads role from DB)
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Only sign with userId
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '2d',
        });

        res.cookie('token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production', // Set to true in production (HTTPS)
            secure: false,
            sameSite: 'Strict',
            maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
        });

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar // Send for frontend UI control
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Optional logout route (clears cookie)
export const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};

// ✅ Admin can update a user's role (organizer, audience)
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const allowedRoles = ['admin', 'organizer', 'audience'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// User requests to become organizer or vendor
export const requestRoleUpgrade = async (req, res) => {
    try {
      const { roleRequest } = req.body;
  
      if (!['organizer', 'vendor'].includes(roleRequest)) {
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
  

  export const getUserCount = async (req, res) => {
    try {
      const count = await User.countDocuments();
      res.status(200).json({ success: true, count });
    } catch (error) {
      console.error('Error fetching user count:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // ✅ Update User Profile (update avatar)
export const updateUserProfile = async (req, res) => {
    try {
      const userId = req.user.userId;  // Assuming userId is in req.user from authentication middleware
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Handle avatar image upload (if exists)
      let avatarUrl = user.avatar;  // Keep existing avatar if no new image is uploaded
      if (req.file) {
        // Upload the new avatar to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        avatarUrl = result.secure_url;  // Get the URL of the uploaded image
      }
  
      // Update the user profile with the new avatar URL
      user.avatar = avatarUrl;
      await user.save();
  
      res.status(200).json({ message: 'User profile updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };


// Get logged-in user's details
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract userId from authenticated request

    // Find the user in the database by ID and return selected details
    const user = await User.findById(userId).select('name email role avatar');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar, 

      // Avatar URL from Cloudinary
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




// ✅ Test Route
export const test = async (req, res) => {
    try {
        res.status(200).json({ message: 'API working fine' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Check Logged-in User
export const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
