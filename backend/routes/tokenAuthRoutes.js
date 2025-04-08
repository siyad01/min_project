import express from "express";
import { isAuth } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/verify", isAuth, (req, res) => {
    // Determine user type
    const userType = req.user.semester ? 'Student' : 
                     req.user.department ? 'Officer' : 
                     'Admin';

    res.status(200).json({ 
        user: {
            ...req.user.toObject(), // Convert Mongoose document to plain object
            userType: userType
        }
    });
});

export default router;
