// // controllers/analyticsController.js
// import Certificate from '../db/models/certificateModel.js';
// import User from '../db/models/userModel.js';
// import Due from '../db/models/dueModel.js';
// import asyncHandler from '../middlewares/asyncHandler.js';

// // @desc    Get System Analytics
// // @route   GET /api/analytics
// export const getSystemAnalytics = asyncHandler(async (req, res, next) => {
//   const totalUsers = await User.countDocuments();
//   const totalStudents = await User.countDocuments({ role: 'student' });
//   const totalOfficeStaff = await User.countDocuments({ role: 'office' });

//   const certificateStats = await Certificate.aggregate([
//     {
//       $group: {
//         _id: '$status',
//         count: { $sum: 1 }
//       }
//     }
//   ]);

//   const dueStats = await Due.aggregate([
//     {
//       $group: {
//         _id: '$status',
//         count: { $sum: 1 },
//         totalAmount: { $sum: '$amount' }
//       }
//     }
//   ]);

//   res.status(200).json({
//     success: true,
//     data: {
//       users: {
//         total: totalUsers,
//         students: totalStudents,
//         officeStaff: totalOfficeStaff
//       },
//       certificates: certificateStats,
//       dues: dueStats
//     }
//   });
// });