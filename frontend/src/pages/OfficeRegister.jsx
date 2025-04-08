/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaCertificate,
  FaChevronLeft,
  FaUserGraduate,
} from "react-icons/fa";
import { UserData } from "../context/authContext.jsx";
import toast from "react-hot-toast";
import cn from "classnames";

const OfficeRegister = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department, setDepartment] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const { registerOfficer } = UserData();

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

  const handleNextStep = () => {
    if (step === 1 && (!firstName || !lastName || !email || !password)) {
      toast.error("Please fill in all fields");
      return;
    }
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    // Validate inputs
    if (!department) {
      console.error("Please select a department");
      setBtnLoading(false);
      return;
    }

    try {
      // Create FormData for multipart form submission
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("department", department);

      // Call registerOfficer function
      await registerOfficer(formData);
      window.location.reload();
      // Show success toast and navigate to login
    } catch (error) {
      console.error("Office Registration error", error);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03] blur-[100px]" />

      {/* Content Container */}
      <div className="relative z-10 p-4 sm:p-8 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-black/50 to-[#0D3B54]/30 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20"
        >
          {/* Header Section */}
          <div className="p-6 md:p-8 border-b border-white/10 bg-gradient-to-r from-[#0D3B54]/30 to-[#1E3A4C]/30">
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <FaUserGraduate className="text-2xl text-rose-400" />
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                  Officer Registration
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-rose-400"></div>
                <span className="text-sm md:text-base text-white/60">
                  Step {step} of 2
                </span>
              </div>
            </motion.div>
          </div>

          {/* Form Section */}
          <div className="p-6 md:p-8">
            <form onSubmit={submitHandler}>
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <motion.div
                    custom={0}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-md md:text-lg font-medium mb-2 text-white/70">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-3 bg-black  border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-md md:text-lg font-medium mb-2 text-white/70">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-white"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    custom={1}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <label className="block text-md md:text-lg font-medium mb-2 text-white/70">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3  border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-white"
                      required
                    />
                  </motion.div>

                  <motion.div
                    custom={2}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <label className="block text-md md:text-lg font-medium mb-2 text-white/70">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3  border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-white"
                      required
                    />
                  </motion.div>

                  <motion.div
                    custom={3}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <label className="block text-md md:text-lg font-medium mb-2 text-white/70">
                      Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-3 bg-black  border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-white"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Office">Office</option>
                      <option value="Library">Library</option>
                      <option value="College Bus">College Bus</option>
                      <option value="Class Tutor">Class Tutor</option>
                    </select>
                  </motion.div>
                  <motion.div
                    custom={3}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.button
                      type="button"
                      onClick={handleNextStep}
                      variants={buttonHoverVariants}
                      whileHover="hover"
                      className="text-md md:text-lg w-full py-4 bg-gradient-to-r from-rose-400/70 to-rose-600/60 text-white font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>Continue</span>
                      <FaArrowRight className="text-md md:text-lg" />
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 3: Review & Submit */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <motion.div
                    custom={0}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <h3 className="text-xl md:text-2xl font-semibold mb-4 text-center text-white">
                      Review Your Information
                    </h3>
                    <div className="space-y-3 mb-6 bg-white/5 p-6 rounded-xl border border-white/10 text-lg md:text-xl">
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/70">Name:</span>
                        <span className="text-white">
                          {firstName} {lastName}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/70">Email:</span>
                        <span className="text-white">{email}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/70">Department:</span>
                        <span className="text-white">{department}</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    custom={1}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        type="button"
                        onClick={handlePrevStep}
                        whileHover={{ scale: 1.02 }}
                        className="text-md md:text-lg py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <FaChevronLeft className="text-md md:text-lg" />
                        <span>Back</span>
                      </motion.button>
                      <motion.button
                        type="submit"
                        variants={buttonHoverVariants}
                        whileHover="hover"
                        disabled={btnLoading}
                        className={cn(
                          "text-md md:text-lg py-3 text-white font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-2 transition-all duration-300 flex items-center justify-center space-x-2",
                          btnLoading
                            ? "bg-rose-600/60 cursor-not-allowed"
                            : "bg-gradient-to-r from-rose-400/70 to-rose-600/60 focus:ring-rose-400/50"
                        )}
                      >
                        {btnLoading ? (
                          <span>Processing...</span>
                        ) : (
                          <>
                            <span>Complete Registration</span>
                            <FaCertificate className="text-md md:text-lg" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </form>
          </div>

          {/* Footer Section */}
          <div className="p-4 border-t border-white/10 text-center">
            <motion.div
              custom={4}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <p className="text-md md:text-lg text-white/50">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-rose-400 hover:underline font-medium"
                >
                  Login here
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Edge Blending Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </div>
  );
};

export default OfficeRegister;
