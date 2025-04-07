import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user to request
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized, invalid token' });
    }
};

export default authMiddleware;
