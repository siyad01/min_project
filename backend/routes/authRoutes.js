import express from "express";
import { login, loginOfficer, loginStudent, registerOfficer, registerStudent, logout } from "../controllers/authController.js";

const router = express.Router();


router.post("/register-student", registerStudent);
router.post("/login-student", loginStudent);


router.post("/register-officer", registerOfficer);
router.post("/login-officer", loginOfficer);

router.post("/login-admin", login);
router.post("/logout", logout);


export default router;