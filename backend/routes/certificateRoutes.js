// // routes/certificateRoutes.js
// import express from 'express';
// import * as certificateController from '../controllers/certificateControllers.js';
// import { protect, authorize } from '../middlewares/authMiddleware.js';

// const router = express.Router();

// // Middleware for authentication and authorization can be added here
// router.route('/')
//   .post(
//     protect, 
//     authorize('student'), 
//     certificateController.createCertificate
//   );

// router.route('/:id')
//   .get(
//     protect, 
//     certificateController.getCertificate
//   )
//   .delete(
//     protect, 
//     authorize('student'), 
//     certificateController.cancelCertificate
//   );

// router.route('/:id/approve')
//   .patch(
//     protect, 
//     authorize('office'), 
//     certificateController.updateCertificateApproval
//   );

// export default router;