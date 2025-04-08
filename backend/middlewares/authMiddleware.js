import jwt from 'jsonwebtoken';
import { Student } from '../db/models/studentModel.js';
import { Officer } from '../db/models/officeModel.js';
import { Admin } from '../db/models/adminModel.js';

export const isAuth = async (req, res, next) => {
    try {
        // Try to get token from cookies or Authorization header
        let token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(403).json({ message: "Please Login" });
        }

        // Verify token
        const decodedData = jwt.verify(token, process.env.JWT_SEC);

        // Find user across different models, including Admin
        let user = await Student.findById(decodedData.id) || 
                   await Officer.findById(decodedData.id) ||
                   await Admin.findById(decodedData.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        console.error("Authentication error:", error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        
        res.status(403).json({ message: "Invalid or expired token" });
    }
};
