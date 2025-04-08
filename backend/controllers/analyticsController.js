// controllers/analyticsController.js
import Certificate from '../db/models/certificateModel.js';
import Due from '../db/models/dueModel.js';
import TryCatch from '../utils/TryCatch.js';
import { Student } from '../db/models/studentModel.js';
import { Officer } from '../db/models/officeModel.js';
import dotenv from 'dotenv';
dotenv.config();
// @desc    Get System Analytics
// @route   GET /api/analytics
export const getSystemAnalytics = TryCatch(async (req, res) => {
  // Count total users
  const totalStudents = await Student.countDocuments();
  const totalOfficeStaff = await Officer.countDocuments();
  const totalUsers = totalStudents + totalOfficeStaff;

  // Certificate Statistics
  const certificateStats = await Certificate.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Transform certificate stats
  const certificateStatsObj = certificateStats.reduce((acc, stat) => {
    switch(stat._id) {
      case 'Pending':
        acc.pending = stat.count;
        break;
      case 'Approved':
        acc.approved = stat.count;
        break;
      case 'Rejected':
        acc.rejected = stat.count;
        break;
      default:
        break;
    }
    return acc;
  }, { 
    total: await Certificate.countDocuments(),
    pending: 0,
    approved: 0,
    rejected: 0 
  });

  // Dues Statistics
  const dueStats = await Due.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  // Transform dues stats
  const duesStatsObj = dueStats.reduce((acc, stat) => {
    switch(stat._id) {
      case 'Cleared':
        acc.cleared = stat.count;
        acc.clearedAmount = stat.totalAmount;
        break;
      case 'Pending':
        acc.pending = stat.count;
        acc.pendingAmount = stat.totalAmount;
        break;
      default:
        break;
    }
    return acc;
  }, { 
    total: await Due.countDocuments(),
    cleared: 0,
    pending: 0,
    clearedAmount: 0,
    pendingAmount: 0
  });

 

  res.status(200).json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        students: totalStudents,
        officeStaff: totalOfficeStaff
      },
      certificates: certificateStatsObj,
      dues: duesStatsObj
    }
  });
});

export const getAdminAnalytics = TryCatch(async (req, res) => {

  // Ensure the request is from an admin
  if (req.user.email != process.env.ADMIN_EMAIL) {
    return res.status(403).json({ 
      message: 'Unauthorized access. Admin rights required.' 
    });
  }

  // Fetch total certificate requests
  const totalCertificateRequests = await Certificate.countDocuments();
  
  // Fetch approved requests
  const approvedRequests = await Certificate.countDocuments({ status: 'Approved' });
  
  // Fetch rejected requests
  const rejectedRequests = await Certificate.countDocuments({ status: 'Rejected' });
  
  // Fetch rejection reasons
  const rejectionReasons = await Certificate.aggregate([
    { $match: { status: 'Rejected' } },
    { $unwind: '$officeApprovals' },
    { $match: { 'officeApprovals.status': 'Rejected' } },
    { $group: { 
        _id: '$officeApprovals.remarks', 
        count: { $sum: 1 } 
    }},
    { $sort: { count: -1 } }
  ]);

  // Convert rejection reasons to an object
  const rejectionReasonsObj = rejectionReasons.reduce((acc, reason) => {
    acc[reason._id || 'Unspecified Reason'] = reason.count;
    return acc;
  }, {});

 
  res.status(200).json({
    totalCertificateRequests,
    approvedRequests,
    rejectedRequests,
    rejectionReasons: rejectionReasonsObj
  });
});