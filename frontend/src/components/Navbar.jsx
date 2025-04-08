/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { UserData } from "../context/authContext";

const Navbar = ({ userType }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuth, logout } = UserData();

  if (!isAuth) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    if (userType === "Admin") {
      navigate("/admin-dash");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getDashboardRoute = () => {
    switch (userType) {
      case "Student":
        return "/student-dash";
      case "Officer":
        return "/office-dash";
      case "Admin":
        return "/admin-dash";
      default:
        return "/";
    }
  };

  const NavLinks = () => (
    <>
      <motion.div whileHover={{ scale: 1.05 }}>
        <Link
          to={getDashboardRoute()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
          onClick={() => setIsMenuOpen(false)}
        >
          <FaHome className="text-indigo-400" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            Dashboard
          </span>
        </Link>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }}>
        <Link
          to="/change-password"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
          onClick={() => setIsMenuOpen(false)}
        >
          <FaUser className="text-rose-400" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            Change Password
          </span>
        </Link>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600/30 to-rose-800/20 hover:from-rose-600/40 hover:to-rose-800/30 transition-all duration-300 w-full"
        >
          <FaSignOutAlt className="text-rose-400" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            Logout
          </span>
        </button>
      </motion.div>
    </>
  );

  return (
    <nav className="bg-gradient-to-b backdrop-blur-sm border-b border-white/10 fixed top-0 w-full z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Left Side */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo4.png"
                alt="Logo"
                className="h-10 w-10 object-contain"
              />
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                No Due Certificate Generator
              </h1>
            </Link>
          </motion.div>

          {/* Right Section - Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden text-lg md:text-xl md:flex items-center space-x-4">
              <NavLinks />
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={toggleMenu}
              whileHover={{ scale: 1.1 }}
              className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
            >
              {isMenuOpen ? (
                <FaTimes className="text-white/80" size={20} />
              ) : (
                <FaBars className="text-white/80" size={20} />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-gradient-to-b from-[#0D3B54]/90 to-[#1E3A4C]/90 backdrop-blur-lg border-b border-white/10 px-4 pb-4"
        >
          <div className="pt-4 flex flex-col items-center gap-4">
            <div className="w-full space-y-2">
              <NavLinks />
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
