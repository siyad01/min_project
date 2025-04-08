import express from "express";
import { createDue,fetchAllDues ,setDueStatus,deleteDue,fetchStudentDues ,requestCashPayment} from "../controllers/dueController.js";
import {isAuth} from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/reg-due", isAuth, createDue);

router.get("/", isAuth, fetchAllDues);

router.get("/:studentId", isAuth, fetchStudentDues);
// router.post("/:dueId/pay", isAuth, payDue);
router.put("/:dueId/status", isAuth, setDueStatus);
router.delete("/:dueId", isAuth, deleteDue);
router.post("/:dueId/cash-payment", isAuth, requestCashPayment);


export default router;