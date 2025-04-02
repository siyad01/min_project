import express from "express";
import { isAuth } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/verify", isAuth, (req, res) => {
    res.status(200).json({ user: req.user });
});

export default router;
