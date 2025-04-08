/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import cn from "classnames";
import {
  FaUserGraduate,
  FaUserTie,
  FaArrowRight,
  FaCertificate,
  FaCheckCircle,
  FaClipboardList,
  FaUniversity,
  FaRocket,
  FaShieldAlt,
  FaCloudUploadAlt,
} from "react-icons/fa";

const ElegantShape = React.memo(
  ({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
  }) => (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute pointer-events-none hidden md:block", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-[48%]",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-sm border-2 border-white/[0.15]",
            "shadow-xl",
            "after:absolute after:inset-0 after:rounded-[48%]",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  )
);
ElegantShape.displayName = 'ElegantShape';

const Home = () => {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.4 + i * 0.15,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  const buttonHoverVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 8px 32px rgba(255, 255, 255, 0.1)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03] blur-[100px]" />
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.1]"
          className="left-[-10%] md:left-[-5%] top-[15%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/[0.1]"
          className="right-[-5%] md:right-[0%] top-[70%]"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 p-4 sm:p-8 w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-br from-black/60 to-black/40"
        >
          {/* Left Section */}
          <div className="flex flex-col justify-center p-6 md:p-14 md:w-1/2 space-y-4 md:space-y-8 relative text-center md:text-left">
            <div className="absolute top-4 left-4 text-white/30">
              <FaCertificate className="text-2xl md:text-4xl" />
            </div>

            <motion.div
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex flex-col items-center md:items-start">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 md:mb-4 tracking-wide">
                  <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/70 font-sans">
                    No Due Certificate Generator
                  </span>
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-normal">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-rose-300 to-amber-200 font-poppins">
                    - College of Engineering Trikaripur
                  </span>
                </h2>
              </div>
            </motion.div>

            <motion.div
              custom={2}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <p className="text-base md:text-lg text-white/50 leading-relaxed font-light tracking-wide max-w-2xl mx-auto md:mx-0">
                Automate your certificate generation with blockchain-verified
                security and instant validation
              </p>
            </motion.div>

            <motion.div
              custom={3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex justify-center md:justify-start items-center space-x-4 mt-4 md:mt-6">
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full" />
              </div>
            </motion.div>

            <motion.div
              custom={4}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="grid grid-cols-3 gap-2 md:gap-4 pt-4 md:pt-6">
                {[
                  { icon: FaCheckCircle, label: "Instant Verification" },
                  { icon: FaClipboardList, label: "Real-time Tracking" },
                  { icon: FaUniversity, label: "Admin Dashboard" },
                ].map(({ icon: Icon, label }, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-2 md:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-default group"
                  >
                    <Icon className="text-xl md:text-2xl mb-1 md:mb-2 text-indigo-400 group-hover:text-white transition-colors" />
                    <span className="text-xs md:text-sm font-medium text-center text-white/80">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col justify-between p-6 md:p-14 md:w-1/2 bg-gradient-to-br from-[#0D3B54]/20 to-[#1E3A4C]/20 space-y-4 md:space-y-8 relative">
            <div className="absolute top-4 right-4 text-white/30">
              <FaCertificate className="text-2xl md:text-4xl" />
            </div>

            <div className="space-y-4 md:space-y-8 flex flex-col items-center">
              <motion.div
                custom={0}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
              >
                <h2 className="text-2xl md:text-4xl font-bold text-white text-center mb-2 md:mb-4">
                  Get Started Now
                </h2>
              </motion.div>

              <motion.div
                custom={1}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="space-y-4 md:space-y-6 w-full max-w-md mx-auto">
                  {[
                    {
                      to: "/student-register",
                      icon: FaUserGraduate,
                      label: "Student Portal",
                      color: "from-indigo-600/30 to-indigo-800/20",
                    },
                    {
                      to: "/office-register",
                      icon: FaUserTie,
                      label: "Officer Portal",
                      color: "from-rose-600/30 to-rose-800/20",
                    },
                    {
                      to: "/login-admin",
                      icon: FaUserTie,
                      label: "Admin Dashboard",
                      color: "from-emerald-600/30 to-emerald-800/20",
                    },
                  ].map(({ to, icon: Icon, label, color }, index) => (
                    <Link to={to} key={index} className="block group">
                      <motion.button
                        variants={buttonHoverVariants}
                        whileHover="hover"
                        className={`w-full px-4 md:px-6 py-3 md:py-5 bg-gradient-to-r ${color} text-white font-semibold rounded-2xl shadow-xl focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 flex items-center justify-between relative overflow-hidden border border-white/10`}
                      >
                        <div className="flex items-center space-x-2 md:space-x-4">
                          <Icon className="text-lg md:text-2xl text-white/80" />
                          <span className="text-sm md:text-base">{label}</span>
                        </div>
                        <FaArrowRight className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                      </motion.button>
                    </Link>
                  ))}
                </div>
              </motion.div>

              <motion.div
                custom={2}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="text-center text-xs md:text-sm text-white/60 mt-2 md:mt-4">
                  <p>
                    Need assistance?{" "}
                    <span className="underline hover:text-white cursor-pointer transition-colors">
                      Contact support
                    </span>
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              custom={3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="bg-gradient-to-br from-[#0D3B54]/20 to-[#1E3A4C]/20 rounded-2xl p-4 md:p-6 space-y-2 md:space-y-4 border border-white/20">
                <div className="flex items-center space-x-2 md:space-x-3 text-white mb-2 md:mb-4">
                  <FaRocket className="text-xl md:text-2xl text-indigo-400" />
                  <h3 className="font-semibold text-base md:text-lg">Why Choose Us?</h3>
                </div>
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  {[
                    { icon: FaShieldAlt, label: "Military-grade Security" },
                    { icon: FaCloudUploadAlt, label: "Cloud Storage" },
                    { icon: FaCertificate, label: "Blockchain Verified" },
                  ].map(({ icon: Icon, label }, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center p-2 md:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-default"
                    >
                      <Icon className="text-base md:text-xl mb-1 text-white/80" />
                      <span className="text-[10px] md:text-xs text-center text-white/80 leading-tight">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] md:text-xs text-center text-white/60 italic mt-2 md:mt-4">
                  &quot;Trusted by 50+ institutions worldwide&quot;
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Edge Blending Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/90 pointer-events-none" />
    </div>
  );
};

export default Home;
