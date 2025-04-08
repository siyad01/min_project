/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { UserData } from '../context/authContext.jsx'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { 
  FaChartBar, 
  FaTimesCircle, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaUsers,
  FaFileAlt,
  FaMoneyBillWave
} from 'react-icons/fa'

const AdminPage = () => {
  const { isAuth, user } = UserData();
  const [analytics, setAnalytics] = useState({
    totalCertificateRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    rejectionReasons: {}
  });
  const [systemAnalytics, setSystemAnalytics] = useState({
    users: {
      total: 0,
      students: 0,
      officeStaff: 0
    },
    dues: {
      total: 0,
      cleared: 0,
      pending: 0,
      clearedAmount: 0,
      pendingAmount: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1, 
      y: 0,
      transition: { 
        delay: custom * 0.2,
        type: "spring",
        stiffness: 100
      }
    })
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('authToken');
        
        // Validate token
        if (!token) {
          throw new Error('Authentication token not found. Please log in.');
        }

        // Validate user is admin
        if (!isAuth || user?.userType !== 'Admin') {
          throw new Error('Unauthorized access. Admin rights required.');
        }

        // Fetch Admin Analytics
        const adminResponse = await axios.get('/api/admin/analytics/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(error => {
          console.error('Admin Analytics Fetch Error:', error);
          throw new Error(error.response?.data?.message || 'Failed to fetch admin analytics');
        });

        // Fetch System Analytics
        const systemResponse = await axios.get('/api/admin/analytics/system', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(error => {
          console.error('System Analytics Fetch Error:', error);
          throw new Error(error.response?.data?.message || 'Failed to fetch system analytics');
        });

        // Update state with fetched data
        setAnalytics(adminResponse.data || {
          totalCertificateRequests: 0,
          approvedRequests: 0,
          rejectedRequests: 0,
          rejectionReasons: {}
        });

        setSystemAnalytics(systemResponse.data?.data || {
          users: {
            total: 0,
            students: 0,
            officeStaff: 0
          },
          dues: {
            total: 0,
            cleared: 0,
            pending: 0,
            clearedAmount: 0,
            pendingAmount: 0
          }
        });

      } catch (error) {
        console.error('Analytics Fetch Error:', error);
        setError(error.message || 'An unexpected error occurred while fetching analytics');
        
        // Reset analytics to default state
        setAnalytics({
          totalCertificateRequests: 0,
          approvedRequests: 0,
          rejectedRequests: 0,
          rejectionReasons: {}
        });
        
        setSystemAnalytics({
          users: {
            total: 0,
            students: 0,
            officeStaff: 0
          },
          dues: {
            total: 0,
            cleared: 0,
            pending: 0,
            clearedAmount: 0,
            pendingAmount: 0
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    // Set up periodic refresh every 5 minutes
    const intervalId = setInterval(fetchAnalytics, 5 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [isAuth, user]);

  // If not authenticated or not an admin, redirect to login
  if (!isAuth || user?.userType !== 'Admin') {
    return <Navigate to="/login-admin" replace />;
  }

  return (
    <div className="relative min-h-screen w-full bg-[#030303] p-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03] blur-[100px]" />
      
      <div className="relative z-10 container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-black/50 to-[#0D3B54]/30 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20"
        >
          {/* Header Section */}
          <div className="p-6 md:p-8 border-b border-white/10 bg-gradient-to-r from-[#0D3B54]/30 to-[#1E3A4C]/30 mt-22">
            <motion.div 
              custom={0} 
              variants={fadeUpVariants} 
              initial="hidden" 
              animate="visible"
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <FaChartBar className="text-3xl text-emerald-400" />
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                  Admin Dashboard
                </h1>
              </div>
            </motion.div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6 md:p-8 space-y-8">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1, 
                    ease: "linear" 
                  }}
                >
                  <FaChartBar className="text-4xl text-indigo-400 animate-pulse" />
                </motion.div>
              </div>
            ) : error ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-center"
              >
                <FaExclamationCircle className="text-4xl text-rose-400 mx-auto mb-4" />
                <p className="text-white/70">{error}</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Certificate Requests Overview */}
                <motion.div 
                  custom={1}
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="text-2xl md:text-3xl font-semibold text-white">Certificate Requests</h2>
                    <FaExclamationCircle className="text-indigo-400" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-all">
                      <p className="text-md md:text-lg text-white/70 mb-2">Total Requests</p>
                      <p className="text-3xl md:text-4xl font-bold text-indigo-400">
                        {analytics?.totalCertificateRequests}
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-all">
                      <p className="text-md md:text-lg text-white/70 mb-2">Approved</p>
                      <p className="text-3xl md:text-4xl font-bold text-emerald-400">
                        {analytics?.approvedRequests}
                        <FaCheckCircle className="inline-block ml-2 text-base" />
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-all">
                      <p className="text-md md:text-lg text-white/70 mb-2">Rejected</p>
                      <p className="text-3xl md:text-4xl font-bold text-rose-400">
                        {analytics?.rejectedRequests}
                        <FaTimesCircle className="inline-block ml-2 text-base" />
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                {/* Rejection Reasons */}
                <motion.div 
                  custom={2}
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="text-2xl md:text-3xl font-semibold text-white">Rejection Reasons</h2>
                    <FaTimesCircle className="text-rose-400" />
                  </div>
                  
                  {analytics?.rejectionReasons && Object.keys(analytics?.rejectionReasons).length > 0 ? (
                    <ul className="space-y-3">
                      {Object.entries(analytics?.rejectionReasons).map(([reason, count], index) => (
                        <motion.li 
                          key={reason}
                          custom={index}
                          variants={fadeUpVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex justify-between bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all"
                        >
                          <span className="text-white/80 font-medium">{reason}</span>
                          <span className="text-rose-400 font-semibold">{count} times</span>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white/70 text-center">No rejection reasons available</p>
                  )}
                </motion.div>

                {/* System Users Overview */}
                <motion.div 
                  custom={3}
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="text-2xl md:text-3xl font-semibold text-white">System Users</h2>
                    <FaUsers className="text-cyan-400" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-all">
                      <p className="text-md md:text-lg text-white/70 mb-2">Total Users</p>
                      <p className="text-3xl md:text-4xl font-bold text-cyan-400">
                        {systemAnalytics?.users?.total}
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-all">
                      <p className="text-md md:text-lg text-white/70 mb-2">Students</p>
                      <p className="text-3xl md:text-4xl font-bold text-emerald-400">
                        {systemAnalytics?.users?.students}
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-all">
                      <p className="text-md md:text-lg text-white/70 mb-2">Staff</p>
                      <p className="text-3xl md:text-4xl font-bold text-indigo-400">
                        {systemAnalytics?.users?.officeStaff}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Dues Overview */}
                <motion.div 
                  custom={5}
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="text-2xl md:text-3xl font-semibold text-white">Dues Overview</h2>
                    <FaMoneyBillWave className="text-emerald-400" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-all">
                      <p className="text-md md:text-lg text-white/70 mb-2">Total Dues</p>
                      <p className="text-3xl md:text-4xl font-bold text-cyan-400">
                        {systemAnalytics?.dues?.total}
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-all">
                      <p className="text-md md:text-lg text-white/70 mb-2">Cleared</p>
                      <p className="text-3xl md:text-4xl font-bold text-emerald-400">
                        {systemAnalytics?.dues?.cleared}
                        <FaCheckCircle className="inline-block ml-2 text-base" />
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-all">
                      <p className="text-md md:text-lg text-white/70 mb-2">Pending</p>
                      <p className="text-3xl md:text-4xl font-bold text-amber-400">
                        {systemAnalytics?.dues?.pending}
                        <FaTimesCircle className="inline-block ml-2 text-base" />
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-all">
                      <p className="text-md md:text-lg text-white/70 mb-2">Cleared Amount</p>
                      <p className="text-2xl md:text-3xl font-bold text-emerald-400">
                        ₹{systemAnalytics?.dues?.clearedAmount?.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-all">
                      <p className="text-md md:text-lg text-white/70 mb-2">Pending Amount</p>
                      <p className="text-2xl md:text-3xl font-bold text-amber-400">
                        ₹{systemAnalytics?.dues?.pendingAmount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Edge Blending Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-transparent via-transparent to-[#030303]/50" />
    </div>
  );
};

export default AdminPage;