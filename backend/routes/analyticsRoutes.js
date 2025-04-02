// // routes/analyticsRoutes.js
// import express from 'express';
// import { getSystemAnalytics } from '../controllers/analyticsController.js';
// import { protect, authorize } from '../middlewares/authMiddleware.js';

// const router = express.Router();

// router.get('/', 
//   protect, 
//   authorize('admin'), 
//   getSystemAnalytics
// );

// export default router;