// import Certificate from '../db/models/certificateModel.js';
// import { findById as findUserById } from '../db/models/userModel.js';
// import asyncHandler from '../middlewares/asyncHandler.js';
// import CustomError from '../middlewares/customError.js';

// export const createCertificate = asyncHandler(async (req, res, next) => {
//   const { studentId, offices } = req.body;

//   // Validate student
//   const student = await findUserById(studentId);
//   if (!student) {
//     return next(new CustomError('Student not found', 404));
//   }

//   // Validate offices (now using user model with role 'office')
//   const officeApprovals = await Promise.all(
//     offices.map(async (officeId) => {
//       const office = await findUserById(officeId);
//       if (!office || office.role !== 'office') {
//         throw new CustomError(`Office with ID ${officeId} not found`, 404);
//       }
//       return {
//         office: officeId,
//         status: 'Pending'
//       };
//     })
//   );

//   const certificate = await Certificate.create({
//     student: studentId,
//     officeApprovals
//   });

//   res.status(201).json({
//     success: true,
//     data: certificate
//   });
// });

// export const getStudentCertificates = asyncHandler(async (req, res, next) => {
//   const { studentId } = req.params;

//   const certificates = await Certificate.find({ student: studentId })
//     .populate('student')
//     .populate('officeApprovals.office');

//   res.status(200).json({
//     success: true,
//     count: certificates.length,
//     data: certificates
//   });
// });

// export const updateCertificateApproval = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { officeId, status, remarks } = req.body;

//   const certificate = await Certificate.findById(id);
//   if (!certificate) {
//     return next(new CustomError('Certificate not found', 404));
//   }

//   const officeApproval = certificate.officeApprovals.find(
//     approval => approval.office.toString() === officeId
//   );

//   if (!officeApproval) {
//     return next(new CustomError('Office not found in this certificate request', 400));
//   }

//   officeApproval.status = status;
//   officeApproval.remarks = remarks || '';
//   officeApproval.approvedAt = new Date();

//   // Use method from the model instance
//   certificate.checkFullApproval();
//   await certificate.save();

//   res.status(200).json({
//     success: true,
//     data: certificate
//   });
// });

// export const getCertificate = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const certificate = await Certificate.findById(id)
//     .populate('student')
//     .populate('officeApprovals.office');

//   if (!certificate) {
//     return next(new CustomError('Certificate not found', 404));
//   }

//   res.status(200).json({
//     success: true,
//     data: certificate
//   });
// });

// export const cancelCertificate = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const certificate = await Certificate.findByIdAndUpdate(
//     id, 
//     { status: 'Rejected' }, 
//     { new: true }
//   );

//   if (!certificate) {
//     return next(new CustomError('Certificate not found', 404));
//   }

//   res.status(200).json({
//     success: true,
//     data: certificate
//   });
// });