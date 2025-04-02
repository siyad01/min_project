/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FaHome, 
  FaUser, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaUserCircle
} from 'react-icons/fa'
import { UserData } from '../context/authContext'

const Navbar = ({userType,user}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { isAuth, logout } = UserData()

  // If not authenticated, return null
  if (!isAuth) {
    return null
  }


  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const getDashboardRoute = () => {
    switch(userType) {
      case 'Student':
        return '/student-dash'
      case 'Office Staff':
        return '/office-dash'
      case 'Admin':
        return '/admin'
      default:
        return '/'
    }
  }

  const getUserRole = () => {
    const officeDepartments = [
      'Office', 
      'Library', 
      'Hostel', 
      'Canteen', 
      'Co-op Store', 
      'Sports Department', 
      'Placement & Training Cell', 
      'CSE Department Labs', 
      'ECE Department Labs', 
      'Civil Department Labs', 
      'EEE Department Labs', 
      'College Bus', 
      'Class Tutor'
    ];
    // Check if user has semester (student)
    if (user?.semester) {
      return 'Student';
    }

    // Check if user has department from office staff list
    if (user?.department && officeDepartments.includes(user.department)) {
      return `${user.department} Staff`;
    }

    // Check for admin role
    if (user?.role === 'admin') {
      return 'Admin';
    }

    // Fallback
    return 'User';
  }

  const NavLinks = () => (
    <>
      <Link 
        to={getDashboardRoute()} 
        className="flex items-center space-x-2 hover:text-[#E0E6E3] transition-colors duration-300 py-2 md:py-0"
        onClick={() => setIsMenuOpen(false)}
      >
        <FaHome />
        <span>Dashboard</span>
      </Link>
      <Link 
        to="/change-password" 
        className="flex items-center space-x-2 hover:text-[#E0E6E3] transition-colors duration-300 py-2 md:py-0"
        onClick={() => setIsMenuOpen(false)}
      >
        <FaUser />
        <span>Change Password</span>
      </Link>
      <button 
        onClick={handleLogout}
        className="flex items-center space-x-2 hover:text-[#E0E6E3] transition-colors duration-300 py-2 md:py-0 text-left w-full md:w-auto"
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </>
  )

  return (
    <nav className="bg-[#0D3B54] text-white py-4 px-6 shadow-md relative">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src="/logo4.png" 
            alt="No Due Certificate Generator" 
            className="h-12 w-12 object-contain"
          />
          <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
            No Due Certificate Generator
          </span>
        </Link>

        {/* User Info and Navigation */}
        <div className="flex items-center space-x-4">
          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <FaUserCircle className="text-2xl" />
            <div className="hidden md:block">
              <p className="text-sm font-semibold">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-300">
                {userType}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex text-lg md:text-xl items-center space-x-8">
            <NavLinks />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#0D3B54] z-50 flex flex-col">
          <div className="flex justify-between items-center p-6">
            <Link 
              to="/" 
              className="flex items-center space-x-3"
              onClick={toggleMenu}
            >
              <img 
                src="/logo4.png" 
                alt="No Due Certificate Generator" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
                No Due Certificate Generator
              </span>
            </Link>

            <button 
              onClick={toggleMenu} 
              className="text-white focus:outline-none"
            >
              <FaTimes size={24} />
            </button>
          </div>
          
          {/* User Info in Mobile View */}
          <div className="flex flex-col items-center mb-6">
            <FaUserCircle className="text-4xl mb-2" />
            <p className="text-lg font-semibold">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-gray-300">
              {getUserRole()}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-6 flex-grow">
            <NavLinks />
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar