import express from "express";
import { 
    login, 
    loginOfficer, 
    loginStudent, 
    registerOfficer, 
    registerStudent, 
    logout, 
    regAdmin, 
    updateStudentProfile, 
    fetchStudentDetails,
    updateOfficerProfile,
    fetchOfficerDetails
} from "../controllers/authController.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register-student", registerStudent);
router.post("/login-student", loginStudent);
router.post("/register-admin", regAdmin);

router.post("/register-officer", registerOfficer);
router.post("/login-officer", loginOfficer);

router.post("/login-admin", login);
router.post("/logout", logout);

router.put("/update-student-profile", isAuth, updateStudentProfile);
router.get("/student-details", isAuth, fetchStudentDetails);

router.put("/update-officer-profile", isAuth, updateOfficerProfile);
router.get("/officer-details", isAuth, fetchOfficerDetails);

export default router;