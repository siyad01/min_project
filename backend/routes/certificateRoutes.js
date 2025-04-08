import express from "express"
import {
  createCertificate, 
  fetchAllMyCertificates, 
  deleteCertificateRequest, 
  fetchAllCertRequests,
  updateCertificateStatus,
  generateCertificatePDF
} from "../controllers/certificateController.js"
import { isAuth } from "../middlewares/authMiddleware.js";  

const router = express.Router();

router.post("/create-certificate", isAuth, createCertificate);
router.get("/:studentId", isAuth, fetchAllMyCertificates);
router.delete("/:certificateId", isAuth, deleteCertificateRequest);
router.get("/all/:officerId", isAuth, fetchAllCertRequests);
router.put("/:certificateId/status", isAuth, updateCertificateStatus);
router.get("/:certificateId/download-pdf", isAuth, generateCertificatePDF);

export default router;
