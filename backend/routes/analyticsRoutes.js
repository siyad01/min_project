import express from 'express';
import { getAdminAnalytics, getSystemAnalytics } from '../controllers/analyticsController.js';
import { isAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', isAuth, getAdminAnalytics);
router.get('/system', isAuth, getSystemAnalytics);

export default router;