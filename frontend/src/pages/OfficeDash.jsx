/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  FaCertificate,
  FaUser,
  FaEdit,
  FaEye,
  FaCheck,
  FaTimes,
  FaMoneyBillWave,
  FaPlus,
} from "react-icons/fa";
import { motion } from "framer-motion";
import "@fontsource/pacifico/400.css";
import cn from "classnames";
import { DueData } from "../context/dueContext";
import { UserData } from "../context/authContext";
import { CertificateData } from "../context/certificateContext";

const pacifico = {
  style: {
    fontFamily: "Pacifico, cursive",
  },
};

const OfficeDash = ({ user }) => {
  // Students List State (simulating a database of students)
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("requests");
  const [confirmDeleteDueId, setConfirmDeleteDueId] = useState(null);

  const { createDue, dues, fetchAllDues, setDueStatus, deleteDue } = DueData();
  const { 
    updateOfficerProfile, 
    fetchOfficerDetails, 
    loading: authLoading, 
    isAuth
  } = UserData();

  const {fetchAllCertRequests, updateCertificateStatus} = CertificateData();
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  const buttonHoverVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 8px 32px rgba(255, 255, 255, 0.1)",
    },
  };

  // Certificate Requests State
  const [certificateRequests, setCertificateRequests] = useState([]);

  // Officer Profile State
  const officerProfile = {
    name: `${user?.firstName} ${user?.lastName}`,
    email: user?.email,
    department: user?.department,
  };

  // Profile Editing State
  const [editedProfile, setEditedProfile] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
  });

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
  
    // Only append changed fields
    Object.keys(editedProfile).forEach(key => {
      if (editedProfile[key] !== user[key]) {
        formData.append(key, editedProfile[key]);
      }
    });

    try {
      await updateOfficerProfile(formData);
      
      setIsEditing(false);
      // Fetch updated officer details
      await fetchOfficerDetails();
      window.location.reload();
      
    } catch (error) {
      console.error("Profile update failed", error);
    }
  };

  // Modal States
  const [newDueModalOpen, setNewDueModalOpen] = useState(false);
  const [newDue, setNewDue] = useState({
    admissionNo: "",
    department: "",
    amount: "",
    description: "",
  });

  // Certificate Status Update State
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [certificateStatusModalOpen, setCertificateStatusModalOpen] = useState(false);
  const [certificateStatus, setCertificateStatus] = useState({
    status: '',
    remarks: ''
  });

  // Update Certificate Status Handler
  const handleUpdateCertificateStatus = async (e) => {
    e.preventDefault();
    
    if (!selectedCertificate) return;

    try {
      await updateCertificateStatus(selectedCertificate._id, {
        status: certificateStatus.status,
        remarks: certificateStatus.remarks
      });
      
      // Update local state
      const updatedRequests = certificateRequests.map(req => 
        req._id === selectedCertificate._id 
          ? { ...req, status: certificateStatus.status } 
          : req
      );
      setCertificateRequests(updatedRequests);
      
      // Close modal
      setCertificateStatusModalOpen(false);
      setSelectedCertificate(null);
    } catch (error) {
      console.error("Failed to update certificate status", error);
    }
  };

  // Open Status Update Modal
  const openStatusUpdateModal = (request, status) => {
    setSelectedCertificate(request);
    setCertificateStatus({
      status: status,
      remarks: ''
    });
    setCertificateStatusModalOpen(true);
  };

  // Request Handling
  const handleApproveRequest = (request) => {
    const updatedRequests = certificateRequests.map((req) =>
      req.id === request.id
        ? {
            ...req,
            status: "Approved",
            certificateUrl: "/generated-certificate.pdf",
          }
        : req
    );
    setCertificateRequests(updatedRequests);
  };

  const handleRejectRequest = (request) => {
    const updatedRequests = certificateRequests.map((req) =>
      req.id === request.id ? { ...req, status: "Rejected" } : req
    );
    setCertificateRequests(updatedRequests);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddDue = async (e) => {
    if (isAuth) {
      const formData = new FormData();
      formData.append("admissionNo", newDue.admissionNo);
      formData.append("department", newDue.department);
      formData.append("amount", newDue.amount);
      formData.append("description", newDue.description);

      try {
        const response = await createDue(formData);
        if (response) {
          setNewDueModalOpen(false);
          // Clear the form
          setNewDue({
            admissionNo: "",
            department: "",
            amount: "",
            description: "",
          });
        }
      } catch (error) {
        console.error("Error adding due:", error);
      }
    } else {
      console.error("Please login first");
    }
  };

  const handleSetDueStatus = async (dueId) => {
    if (isAuth) {
      try {
        await setDueStatus(dueId, "Paid");
      } catch (error) {
        console.error("Error setting due status:", error);
      }
    } else {
      console.error("Please login first");
    }
  };

  const handleDeleteDue = async () => {
    if (confirmDeleteDueId) {
      await deleteDue(confirmDeleteDueId);
      setConfirmDeleteDueId(null);
    }
  };

  useEffect(() => {
    if (isAuth ) {
      const fetchCertificates = async () => {
        const certificateData = await fetchAllCertRequests(user._id);
        setCertificateRequests(certificateData.certificates);
      };
      
      fetchAllDues();
      fetchCertificates();
    }
  }, [isAuth]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#090909] text-white px-4 sm:px-8 py-8">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03] blur-[100px]" />

      <div className="relative z-10 max-w-6xl mx-auto mt-22 border-b border-gray-200 dark:border-[#1F1F23]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1
              className={cn(
                "text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80",
                pacifico.style.fontFamily
              )}
            >
              Officer Dashboard
            </h1>
            <p className="text-white/60 mt-2 text-xl md:text-2xl">
              Welcome back, {user?.firstName} Sir
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <FaCertificate className="text-2xl text-indigo-400" />
            <span className="text-md md:text-lg bg-white/10 px-3 py-1 rounded-full">
              {user?.department}
            </span>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          custom={0}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="flex space-x-2 mb-8 border-b border-white/10"
        >
          {[
            { id: "requests", label: "Certificate Requests" },
            { id: "dues", label: "Dues Management" },
            { id: "profile", label: "Officer Profile" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-lg md:text-xl font-medium relative",
                activeTab === tab.id
                  ? "text-white"
                  : "text-white/60 hover:text-white"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-400"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Certificate Requests Tab */}
        {activeTab === "requests" && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl overflow-hidden mb-8"
          >
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                Certificate Requests
              </h2>
              <div className="overflow-x-auto text-md md:text-lg">
                <table className="w-full text-left">
                  <thead className="bg-white/10 text-white/70">
                    <tr>
                      <th className="p-3">Student</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificateRequests.map((request) => (
                      <tr
                        key={request?._id}
                        className="border-b border-white/10 hover:bg-white/5"
                      >
                        <td className="p-3">{request?.studentId?.firstName} {request?.studentId?.lastName}</td>
                        <td className="p-3">{request?.studentId?.department}</td>
                        <td className="p-3">{request?.requestDate?.split('T')[0]}</td>
                        <td className="p-3">{request?.purpose}</td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-md md:text-lg ${getStatusColor(
                              request?.status
                            )}`}
                          >
                            {request?.status}
                          </span>
                        </td>
                        <td className="p-3 flex space-x-2">
                          {request?.status === "PENDING" && (
                            <>
                              <motion.button
                                whileHover="hover"
                                variants={buttonHoverVariants}
                                onClick={() => openStatusUpdateModal(request, "Approved")}
                                className="text-green-400 hover:text-green-500"
                                title="Approve Request"
                              >
                                <FaCheck />
                              </motion.button>
                              <motion.button
                                whileHover="hover"
                                variants={buttonHoverVariants}
                                onClick={() => openStatusUpdateModal(request, "Rejected")}
                                className="text-red-400 hover:text-red-500"
                                title="Reject Request"
                              >
                                <FaTimes />
                              </motion.button>
                            </>
                          )}
                          {request?.status === "PROCESSING" && (
                            <motion.button
                              whileHover="hover"
                              variants={buttonHoverVariants}
                              onClick={() => openStatusUpdateModal(request, request?.status)}
                              className="text-blue-400 hover:text-blue-500"
                              title="Update Status"
                            >
                              <FaEdit />
                            </motion.button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>
        )}

        {/* Dues Management Tab */}
        {activeTab === "dues" && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl overflow-hidden mb-8"
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold text-white">
                  Dues Management
                </h2>
                <motion.button
                  onClick={() => setNewDueModalOpen(true)}
                  whileHover="hover"
                  variants={buttonHoverVariants}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600/70 to-indigo-800/60 text-white font-medium flex items-center gap-2 text-md md:text-lg"
                >
                  <FaPlus size={14} /> Add New Due
                </motion.button>
              </div>

              <div className="p-6 md:p-8">
                {/* ... existing header */}
                <div className="space-y-4">
                  {dues.length > 0 ? (
                    dues.map((due, index) => (
                      <motion.div
                        key={due?._id || index}
                        custom={index}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex justify-between items-center bg-white/10 p-4 rounded-xl"
                      >
                        <div className="text-md md:text-lg">
                          <span className="font-medium text-white">
                            {due?.studentName}
                          </span>
                          <span className="block text-md md:text-lg text-white/60">
                            {due?.department} - {due?.description}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-md md:text-lg">
                          <span className="font-bold text-white ">
                            ₹{due?.amount}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full  ${getStatusColor(
                              due?.status
                            )}`}
                          >
                            {due?.status}
                          </span>
                          {due?.status !== "Paid" && (
                            <button
                              onClick={() => handleSetDueStatus(due?._id)}
                              className="ml-2 px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                            >
                              Mark as Paid
                            </button>
                          )}
                          {due.status === "Paid" && (
                            <button
                              onClick={() => setConfirmDeleteDueId(due._id)}
                              className="ml-2 px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-white/60 text-center">No dues found</p>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl overflow-hidden mb-8"
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold text-white">
                  Profile Information
                </h2>
                <motion.button
                  onClick={() => setIsEditing(!isEditing)}
                  whileHover="hover"
                  variants={buttonHoverVariants}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600/70 to-indigo-800/60 text-white font-medium flex items-center gap-2 text-md md:text-lg"
                >
                  <FaEdit size={14} /> {isEditing ? "Cancel" : "Edit Profile"}
                </motion.button>
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  {[
                    { key: 'firstName', label: 'First Name' },
                    { key: 'lastName', label: 'Last Name' },
                    { key: 'email', label: 'Email' },
                  ].map((field, index) => (
                    <motion.div
                      key={field.key}
                      custom={index}
                      variants={fadeUpVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-2"
                    >
                      <label className="block text-sm font-medium text-white/70 capitalize">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        name={field.key}
                        value={editedProfile[field.key] || ''}
                        onChange={handleProfileInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-white"
                      />
                    </motion.div>
                  ))}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button 
                      type="submit"
                      disabled={authLoading}
                      className={`
                        px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600/70 to-indigo-800/60 text-white font-medium
                        ${authLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
                      `}
                    >
                      {authLoading ? 'Updating...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(officerProfile).map(([key, value], index) => (
                    <motion.div
                      key={key}
                      custom={index}
                      variants={fadeUpVariants}
                      initial="hidden"
                      animate="visible"
                      className="bg-white/5 p-4 rounded-xl border border-white/10"
                    >
                      <p className="text-sm text-white/70 uppercase tracking-wider">
                        {key.replace(/([A-Z])/g, " $1")}
                      </p>
                      <p className="text-lg mt-1">{value || "Not provided"}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        )}
      </div>

      {/* New Due Modal */}
      {newDueModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 w-96 shadow-2xl"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              Add New Due
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Student Admission Number
                </label>
                <input
                  type="text"
                  value={newDue.admissionNo}
                  onChange={(e) =>
                    setNewDue((prev) => ({
                      ...prev,
                      admissionNo: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={newDue.department}
                  onChange={(e) =>
                    setNewDue((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={newDue.amount}
                  onChange={(e) =>
                    setNewDue((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Description
                </label>
                <textarea
                  value={newDue.description}
                  onChange={(e) =>
                    setNewDue((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-white"
                  rows="3"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setNewDueModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDue}
                  type="button"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600/70 to-indigo-800/60 text-white font-medium"
                >
                  Add Due
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Certificate Status Update Modal */}
      {certificateStatusModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 w-96 shadow-2xl"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              Update Certificate Status
            </h2>
            <form onSubmit={handleUpdateCertificateStatus} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Status
                </label>
                <select
                  value={certificateStatus.status}
                  onChange={(e) =>
                    setCertificateStatus((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-white"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Remarks
                </label>
                <textarea
                  value={certificateStatus.remarks}
                  onChange={(e) =>
                    setCertificateStatus((prev) => ({
                      ...prev,
                      remarks: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-white"
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCertificateStatusModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600/70 to-indigo-800/60 text-white font-medium"
                >
                  Update Status
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {confirmDeleteDueId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 w-96 shadow-2xl text-center"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              Confirm Deletion
            </h2>
            <p className="text-white/70 mb-6">
              Are you sure you want to delete this paid due?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setConfirmDeleteDueId(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDue}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OfficeDash;
