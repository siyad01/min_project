/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { UserData } from '../context/authContext.jsx'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

const AdminPage = () => {
  const { isAuth, user } = UserData();
  const [analytics, setAnalytics] = useState({
    totalCertificateRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    rejectionReasons: {}
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const { data } = await axios.get('/api/admin/analytics', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };

    if (isAuth && user?.role === 'admin') {
      fetchAnalytics();
    }
  }, [isAuth, user]);

  // If not authenticated or not an admin, redirect to login
  if (!isAuth || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Certificate Requests Overview */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Certificate Requests Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h3 className="text-sm text-gray-600">Total Requests</h3>
                <p className="text-2xl font-bold text-blue-600">{analytics.totalCertificateRequests}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h3 className="text-sm text-gray-600">Approved</h3>
                <p className="text-2xl font-bold text-green-600">{analytics.approvedRequests}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <h3 className="text-sm text-gray-600">Rejected</h3>
                <p className="text-2xl font-bold text-red-600">{analytics.rejectedRequests}</p>
              </div>
            </div>
          </div>
          
          {/* Rejection Reasons */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Rejection Reasons</h2>
            <ul className="space-y-2">
              {Object.entries(analytics.rejectionReasons).map(([reason, count]) => (
                <li key={reason} className="flex justify-between bg-gray-50 p-3 rounded-md">
                  <span className="text-gray-700">{reason}</span>
                  <span className="text-gray-500 font-semibold">{count} times</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage