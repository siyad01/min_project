// // routes/dueRoutes.js
// import express from 'express';
// import * as dueController from '../controllers/dueController.js';
// import { protect, authorize } from '../middlewares/authMiddleware.js';

// const router = express.Router();

// router.post('/', 
//   protect, 
//   authorize('office'), 
//   dueController.createDue
// );

// router.post('/:id/pay', 
//   protect, 
//   authorize('student'), 
//   dueController.payDue
// );

// router.get('/students', 
//   protect, 
//   authorize('student'), 
//   dueController.getStudentDues
// );

// export default router;