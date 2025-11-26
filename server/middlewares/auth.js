import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            console.log('Token received:', token ? 'Yes' : 'No');

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token decoded, user ID:', decoded.id);

            // Get user from token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.log('User not found for ID:', decoded.id);
                return res.status(401).json({ message: 'User not found' });
            }

            console.log('User authenticated:', req.user.email);
            next();
        } catch (error) {
            console.error('Token verification error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        console.log('No token provided in request');
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};
