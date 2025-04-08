/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  FaCertificate,
  FaEdit,
  FaDownload,
  FaMoneyBillWave,
  FaUserGraduate,
  FaChevronRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import "@fontsource/pacifico/400.css";
import cn from "classnames";
import { DueData } from "../context/dueContext";
import { UserData } from "../context/authContext";
import { CertificateData } from "../context/certificateContext";
import { InfoIcon, X } from "lucide-react";
import { Loading } from "../components/Loading";
import axios from 'axios';

const pacifico = {
  style: {
    fontFamily: "Pacifico, cursive",
  },
};

const ElegantShape = React.memo(
  ({ className, delay = 0, rotate = 0, size = "md" }) => {
    const sizes = {
      sm: { width: 200, height: 80 },
      md: { width: 300, height: 100 },
      lg: { width: 400, height: 120 },
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: -100, rotate: rotate - 10 }}
        animate={{ opacity: 1, y: 0, rotate }}
        transition={{
          duration: 2.4,
          delay,
          ease: [0.23, 0.86, 0.39, 0.96],
          opacity: { duration: 1.2 },
        }}
        className={cn("absolute pointer-events-none", className)}
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={sizes[size]}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/10 shadow-lg" />
        </motion.div>
      </motion.div>
    );
  }
);

ElegantShape.displayName = "ElegantShape";

const StudentDash = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedDue, setSelectedDue] = useState(null);
  const [cashPaymentDetails, setCashPaymentDetails] = useState(null);
  const [purpose, setPurpose] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [certificateError, setCertificateError] = useState(null);

  const { updateStudentProfile, fetchStudentDetails, loading: authLoading, isAuth, user: userData } = UserData();
  const { dues, fetchStudentDues, loading, requestCashPayment } = DueData();
  const { createCertificate, certificates, fetchAllMyCertRequests, deleteCertificateRequest } = CertificateData();
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
  useEffect(() => {
    if (isAuth) {
      fetchStudentDues(user?._id);
      fetchAllMyCertRequests(user?._id);
    }
  }, [isAuth, user?._id]);

  const handleCashPaymentRequest = async (due) => {
    try {
      const response = await requestCashPayment(due?._id);
      if (response) {
        setCashPaymentDetails({
          amount: due?.amount,
          message: response?.message,
          officeStaff: response?.officeStaff,
        });
        setSelectedDue(due);
      }
    } catch (error) {
      console.error("Cash payment request failed", error);
    }
  };

  const handleRequestCertificate = async (e) => {
    e.preventDefault();
    setCertificateLoading(true);
    setCertificateError(null);

    try {
      const certificateFormData = new FormData();
      certificateFormData.append("studentId", userData?._id);
      certificateFormData.append("purpose", purpose);

      await createCertificate(certificateFormData);
      
      setShowCertificateModal(false);
      setPurpose("");
      
      // Refresh certificate requests
      await fetchAllMyCertRequests(userData?._id);
    } catch (error) {
      console.error("Certificate request failed", error);
      setCertificateError(
        error.response?.data?.message || 
        "Failed to submit certificate request. Please try again."
      );
    } finally {
      setCertificateLoading(false);
    }
  };

  const buttonHoverVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 8px 32px rgba(255, 255, 255, 0.1)",
    },
  };

  const studentProfile = {
    name: `${userData?.firstName} ${userData?.lastName}`,
    email: userData?.email,
    department: userData?.department,
    semester: userData?.semester,
    admissionNo: userData?.admissionNo,
    contactNo: userData?.phone,
  };

  const [editedProfile, setEditedProfile] = useState({
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    email: userData?.email,
    phone: userData?.phone,
    semester: userData?.semester,
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
  
    // Only append changed fields
    Object.keys(editedProfile).forEach(key => {
      if (editedProfile[key] !== userData[key]) {
        formData.append(key, editedProfile[key]);
      }
    });

    try {
      await updateStudentProfile(formData);
      
      // Fetch updated student details
      await fetchStudentDetails();
      window.location.reload();
      
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update failed", error);
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteCertificateRequest = async (certId) => {
    try {
      await deleteCertificateRequest(certId);
      setSelectedCertificate(null);
    } catch (error) {
      console.error("Failed to delete certificate request", error);
    }
  };

  const handleDownloadCertificate = async (certificateId) => {
    try {
      const response = await axios.get(`/api/certificates/${certificateId}/download-pdf`, {
        responseType: 'blob', // Important for handling binary data
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token-based auth
        }
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `no_dues_certificate_${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download certificate", error);
      // Show user-friendly error message
      alert(
        error.response?.data?.message || 
        "Failed to download certificate. Please ensure the certificate is approved."
      );
    }
  };

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
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
        >
          <div>
            <h1
              className={cn(
                "text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80",
                pacifico.style.fontFamily
              )}
            >
              Student Dashboard
            </h1>
            <p className="text-white/60 mt-2 text-xl md:text-2xl">
              Welcome back, {userData?.firstName}
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <FaUserGraduate className="text-2xl text-indigo-400" />
            <span className="text-md md:text-lg bg-white/10 px-3 py-1 rounded-full">
              {userData?.department} - Sem {userData?.semester}
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
            { id: "certificates", label: "Certificates" },
            { id: "dues", label: "Dues" },
            { id: "profile", label: "Profile" },
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

        {/* Certificates Tab */}
        {activeTab === "certificates" && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl overflow-hidden mb-8"
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold text-white flex items-center gap-3">
                  <FaCertificate className="text-yellow-400" />
                  Certificate Requests
                </h2>
                <button 
                onClick={() => setShowCertificateModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600/70 to-indigo-800/60 text-white font-medium text-md">
                  New Request
                </button>
              </div>

              {certificates.length > 0 ? (
                <div className="space-y-4">
                  {certificates.map((cert, index) => (
                    <motion.div
                      key={cert?._id}
                      custom={index}
                      variants={fadeUpVariants}
                      initial="hidden"
                      animate="visible"
                      className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-center text-md md:text-lg">
                        <div>
                          <h3 className="font-medium text-xl">{cert.purpose}</h3>
                          <p className=" text-white/60 mt-1">
                            Requested on: {cert?.requestDate?.split('T')[0]} • Status:
                            <span
                              className={cn("ml-2", {
                                "text-yellow-400": cert?.status === "Pending",
                                "text-green-400": cert?.status === "Approved",
                              })}
                            >
                              {cert?.status}
                            </span>
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {cert?.status === "Approved" && (
                            <button 
                            type="button"
                            onClick={() => handleDownloadCertificate(cert._id)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
                              <FaDownload className="text-green-400" />
                            </button>
                          )}
                          <button 
                          onClick={() => setSelectedCertificate(cert)}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
                            <FaChevronRight className="text-white/80" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  custom={0}
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-center py-12"
                >
                  <FaCertificate className="mx-auto text-4xl text-white/30 mb-4" />
                  <p className="text-white/60">
                    You have no certificate requests yet.
                  </p>
                 
                </motion.div>
              )}
            </div>
          </motion.section>
        )}

        {/* Dues Tab */}
        {activeTab === "dues" && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl overflow-hidden mb-8"
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold text-white flex items-center gap-3">
                  <FaMoneyBillWave className="text-green-400" />
                  Pending Dues
                </h2>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-white/60">Loading dues...</p>
                </div>
              ) : dues && dues.length > 0 ? (
                <div className="space-y-4">
                  {dues?.map((due, index) => (
                    <motion.div
                      key={due?._id || `due-${index}`}
                      custom={index}
                      variants={fadeUpVariants}
                      initial="hidden"
                      animate="visible"
                      className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex justify-between items-center text-md md:text-lg">
                        <div>
                          <h3 className="font-medium text-lg md:text-xl">
                            {due?.description}
                          </h3>
                          <p className="text-white/60 mt-1">
                            Department: {due?.officeStaff} • Created:{" "}
                            {new Date(due?.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-lg md:text-xl font-medium text-rose-400">
                            ₹{due?.amount}
                          </span>
                          <button
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600/70 to-indigo-800/60 text-white font-medium text-md md:text-lg"
                            onClick={() => handleCashPaymentRequest(due)}
                          >
                            Pay Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  custom={0}
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-center py-12"
                >
                  <FaMoneyBillWave className="mx-auto text-4xl text-white/30 mb-4" />
                  <p className="text-white/60">
                    You have no pending dues. Good job!
                  </p>
                </motion.div>
              )}
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
                    { key: 'phone', label: 'Contact Number' },
                    { key: 'semester', label: 'Semester' },
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
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition"
                    >
                      Cancel
                    </button>
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
                  {Object.entries(studentProfile).map(([key, value], index) => (
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

      {/* Add a modal for cash payment details */}
      {selectedDue && cashPaymentDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 w-96 shadow-2xl text-center"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              Cash Payment Details
            </h2>
            <p className="text-white/70 mb-4">{cashPaymentDetails.message}</p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
              <p className="text-xl font-medium text-white">
                {cashPaymentDetails.officeStaff.name}
              </p>
              <p className="text-white/60">
                {cashPaymentDetails.officeStaff.department} Office
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setSelectedDue(null);
                  setCashPaymentDetails(null);
                }}
                className="px-4 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {selectedCertificate && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/10 w-[90%] max-w-md rounded-2xl p-6 shadow-2xl relative border border-white/10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-4 right-4 text-white/70 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-white">
              Certificate Request Details
            </h2>

            <div className="space-y-4 text-white">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-white/70 uppercase tracking-wider">Purpose</p>
                <p className="text-lg mt-1">{selectedCertificate.purpose}</p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-white/70 uppercase tracking-wider">Status</p>
                <p 
                  className={cn("text-lg mt-1", {
                    "text-yellow-400": selectedCertificate?.status === "PENDING",
                    "text-green-400": selectedCertificate?.status === "APPROVED",
                    "text-red-400": selectedCertificate?.status === "REJECTED"
                  })}
                >
                  {selectedCertificate.status}
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-white/70 uppercase tracking-wider">Request Date</p>
                <p className="text-lg mt-1">
                  {new Date(selectedCertificate.requestDate).toLocaleDateString()}
                </p>
              </div>

              {selectedCertificate.status === "REJECTED" && (
                <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                  <p className="text-sm text-white/70 uppercase tracking-wider">Rejection Reason</p>
                  <p className="text-lg mt-1 text-red-300">
                    {selectedCertificate.rejectionReason || "No specific reason provided"}
                  </p>
                </div>
              )}
            </div>

            <motion.div
              className="mt-6 flex justify-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {selectedCertificate.status === "PENDING" && (
                <button
                  onClick={() => handleDeleteCertificateRequest(selectedCertificate._id)}
                  className="px-6 py-2 rounded-lg bg-red-600/70 text-white hover:bg-red-700 transition-colors"
                >
                  Delete Request
                </button>
              )}
             
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {showCertificateModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/10 w-[90%] max-w-md rounded-2xl p-6 shadow-2xl relative border border-white/10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-white text-center">
              No Due Certificate Request
            </h2>

            <div className="space-y-4 text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 p-4 rounded-xl border border-white/10"
              >
                <label
                  htmlFor="purpose"
                  className="block text-sm text-white/70 uppercase tracking-wider mb-2"
                >
                  Purpose of Certificate
                </label>
                <input
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-white"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 flex items-center"
              >
                <InfoIcon className="text-blue-400 mr-3" size={20} />
                <p className="text-white/70 text-sm">
                  Ensure all your dues are cleared before requesting the certificate.
                </p>
              </motion.div>
            </div>

            {certificateError && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 p-4 rounded-xl border border-red-500/20 mb-4"
              >
                <p className="text-red-300 text-center">{certificateError}</p>
              </motion.div>
            )}

            <motion.div
              className="mt-6 flex justify-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={handleRequestCertificate}
                disabled={!purpose || certificateLoading}
                className={`
                  px-6 py-2 rounded-lg transition-all 
                  ${
                    purpose && !certificateLoading
                      ? "bg-gradient-to-r from-indigo-600/70 to-indigo-800/60 text-white hover:opacity-90"
                      : "bg-white/10 text-white/50 cursor-not-allowed"
                  }
                `}
              >
                {certificateLoading ? (
                  <Loading size="sm" className="mx-auto" />
                ) : (
                  "Request Certificate"
                )}
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Edge Blending Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-[#090909]/80 pointer-events-none" />
    </div>
  );
};

export default StudentDash;
