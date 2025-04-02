// // controllers/dueController.js
// import { create, findById } from '../db/models/dueModel.js';
// import { findOne } from '../db/models/userModel.js';
// import asyncHandler from '../middlewares/asyncHandler.js';
// import CustomError from '../middlewares/customError.js';
// // import sendSMS from '../utils/smsService.js';

// export const createDue = asyncHandler(async (req, res, next) => {
//   const { studentEmail, amount, description, department } = req.body;
//   const officeStaff = req.user._id;

//   // Find student
//   const student = await findOne({ email: studentEmail, role: 'student' });
//   if (!student) {
//     return next(new CustomError('Student not found', 404));
//   }

//   // Create due
//   const due = await create({
//     student: student._id,
//     officeStaff,
//     amount,
//     description,
//     department
//   });

//   // Send SMS to student

//   res.status(201).json({
//     success: true,
//     data: due,
//     number: student.mobileNumber
//   });
// });

// export const payDue = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { transactionId } = req.body;

//   const due = await findById(id);
//   if (!due) {
//     return next(new CustomError('Due not found', 404));
//   }

//   due.status = 'Paid';
//   due.paymentDetails = {
//     transactionId,
//     paymentDate: new Date()
//   };

//   await due.save();

//   res.status(200).json({
//     success: true,
//     data: due
//   });
// });