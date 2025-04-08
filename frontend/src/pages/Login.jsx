/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaArrowRight, FaHome } from "react-icons/fa";
import { UserData } from "../context/authContext.jsx";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';
import cn from 'classnames';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("student");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { loginStudent, loginOfficer } = UserData();

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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let loginFunction;
      switch (userType) {
        case "student":
          loginFunction = loginStudent;
          break;
        case "office":
          loginFunction = loginOfficer;
          break;
        default:
          throw new Error("Invalid user type");
      }

      await loginFunction(email, password);
      // Navigate based on user type
      switch (userType) {
        case "student":
          navigate("/student-dash");
          break;
        case "office":
          navigate("/office-dash");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  let color;
  let bgs;
  if (userType === "student") {
     color = "text-indigo-500/70";
     bgs = "bg-gradient-to-r from-indigo-600/70 to-indigo-800/60";
  } 
  else{
    color = "text-rose-500/70";
    bgs = "bg-gradient-to-r from-rose-600/70 to-rose-800/60";
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
      {/* Background Effects */}
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
                <FaSignInAlt className={`text-2xl ${color}`} />
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                  {userType === "student" ? "Student" : "Office Staff"} Login
                </h1>
              </div>
              <motion.button
                onClick={() => navigate('/')}
                variants={buttonHoverVariants}
                whileHover="hover"
                className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                title="Back to Home"
              >
                <FaHome className="text-white/70 text-md md:text-lg" />
              </motion.button>
            </motion.div>
          </div>

          {/* Form Section */}
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <motion.div custom={0} variants={fadeUpVariants} initial="hidden" animate="visible">
                  <label className="block text-md md:text-lg font-medium mb-2 text-white/70">Login As</label>
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-white"
                  >
                    <option value="student">Student</option>
                    <option value="office">Office Staff</option>
                  </select>
                </motion.div>

                <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
                  <label className="block text-md md:text-lg font-medium mb-2 text-white/70">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-white"
                    required
                  />
                </motion.div>

                <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
                  <label className="block text-md md:text-lg font-medium mb-2 text-white/70">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-white"
                    required
                  />
                </motion.div>

                <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="visible">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    variants={buttonHoverVariants}
                    whileHover="hover"
                    className={`text-md md:text-lg w-full py-4 ${bgs} text-white font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all duration-300 flex items-center justify-center space-x-2`}
                  >
                    <span>{loading ? 'Logging in...' : 'Login'}</span>
                    {!loading && <FaArrowRight className="text-md md:text-lg" />}
                  </motion.button>
                </motion.div>
              </motion.div>
            </form>

            <motion.div 
              custom={4} 
              variants={fadeUpVariants} 
              initial="hidden" 
              animate="visible"
              className="mt-6 text-center"
            >
              <p className="text-md md:text-lg text-white/70">
                Don't have an account?{" "}
                <Link
                  to="/student-register"
                  className={`font-bold ${color} hover:underline`}
                >
                  Register as Student
                </Link>{" "}
                or{" "}
                <Link
                  to="/office-register"
                  className={`font-bold ${color} hover:underline`}
                >
                  Register as Office Staff
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
