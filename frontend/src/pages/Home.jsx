import React from 'react'
import { Link } from 'react-router-dom'
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
  FaCloudUploadAlt
} from 'react-icons/fa'

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0E6E3] via-[#5A6D7C] to-[#0D3B54] p-4 sm:p-8 overflow-hidden">
      <div className="flex flex-col md:flex-row max-w-6xl w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 md:h-136 transform transition-all duration-300 hover:scale-[1.01] ">
        
        {/* Left Section: App Name */}
        <div className="flex flex-col justify-center p-6 md:p-12 md:w-1/2 bg-white/90 md:rounded-l-3xl space-y-4 md:space-y-6 relative">
          <div className="absolute top-4 left-4 text-[#0D3B54]/30">
            <FaCertificate className="text-2xl md:text-3xl" />
          </div>
          
          <div className="text-center mt-4 md:mt-0 z-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1E3A4C] mb-2 md:mb-3 font-sans tracking-tight leading-tight">
              No Due Certificate Generator
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl text-[#0D3B54] font-semibold">
              - CETKR
            </h2>
          </div>
          
          <p className="text-base md:text-xl text-gray-600 text-center max-w-md mx-auto leading-relaxed z-10">
            Streamline your certificate generation process with precision and ease
          </p>
          
          <div className="flex justify-center items-center space-x-4 mt-4 md:mt-6 z-10">
            <div className="w-16 h-1 bg-[#0D3B54]/50 rounded-full"></div>
            <span className="text-[#0D3B54]/70 text-xs md:text-sm font-medium">Simplified Workflow</span>
            <div className="w-16 h-1 bg-[#0D3B54]/50 rounded-full"></div>
          </div>
          
          {/* Additional Details Section */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 pt-4 md:pt-6 z-10">
            <div className="flex flex-col items-center text-[#0D3B54]/70 hover:text-[#0D3B54] transition-colors group">
              <FaCheckCircle className="text-xl md:text-2xl mb-1 md:mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-2xs md:text-xs font-medium text-center">Quick Verification</span>
            </div>
            <div className="flex flex-col items-center text-[#0D3B54]/70 hover:text-[#0D3B54] transition-colors group">
              <FaClipboardList className="text-xl md:text-2xl mb-1 md:mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-2xs md:text-xs font-medium text-center">Comprehensive Tracking</span>
            </div>
            <div className="flex flex-col items-center text-[#0D3B54]/70 hover:text-[#0D3B54] transition-colors group">
              <FaUniversity className="text-xl md:text-2xl mb-1 md:mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-2xs md:text-xs font-medium text-center">Institutional Support</span>
            </div>
          </div>
        </div>
        
        {/* Right Section: Registration */}
        <div className="flex flex-col justify-between p-6 md:p-12 md:w-1/2 bg-white/80 md:rounded-r-3xl space-y-4 md:space-y-6 relative">
          <div className="absolute top-4 right-4 text-[#1E3A4C]/30">
            <FaCertificate className="text-2xl md:text-3xl" />
          </div>
          
          <div className="space-y-4 md:space-y-6 flex flex-col items-center">
            <h2 className="text-2xl md:text-4xl font-bold text-[#1E3A4C] text-center mb-2 md:mb-4">
              Get Started
            </h2>
            
            <div className="space-y-4 md:space-y-6 w-full max-w-md mx-auto">
              <Link to="/student-register" className="block group">
                <button className="w-full px-4 md:px-8 py-3 md:py-5 bg-[#0D3B54] text-white font-semibold rounded-xl 
                  shadow-lg hover:bg-[#1E3A4C] focus:outline-none focus:ring-2 focus:ring-[#0D3B54] 
                  focus:ring-opacity-50 transition-all duration-300 flex items-center justify-between 
                  group-hover:pr-6 group-hover:pl-4 relative overflow-hidden">
                  <div className="flex items-center">
                    <FaUserGraduate className="mr-2 md:mr-4 text-base md:text-xl" />
                    <span className="text-sm md:text-base">Student Registration</span>
                  </div>
                  <FaArrowRight className="opacity-0 group-hover:opacity-100 absolute right-6 transition-all duration-300" />
                </button>
              </Link>
              
              <Link to="/office-register" className="block group">
                <button className="w-full px-4 md:px-8 py-3 md:py-5 bg-[#1E3A4C] text-white font-semibold rounded-xl 
                  shadow-lg hover:bg-[#0D3B54] focus:outline-none focus:ring-2 focus:ring-[#1E3A4C] 
                  focus:ring-opacity-50 transition-all duration-300 flex items-center justify-between 
                  group-hover:pr-6 group-hover:pl-4 relative overflow-hidden">
                  <div className="flex items-center">
                    <FaUserTie className="mr-2 md:mr-4 text-base md:text-xl" />
                    <span className="text-sm md:text-base">Officer Registration</span>
                  </div>
                  <FaArrowRight className="opacity-0 group-hover:opacity-100 absolute right-6 transition-all duration-300" />
                </button>
              </Link>
            </div>
            
            {/* Additional Registration Info */}
            <div className="text-center text-xs md:text-sm text-[#1E3A4C]/70 mt-2 md:mt-4">
              <p>New to the platform? 
                <span className="ml-1 underline hover:text-[#0D3B54] cursor-pointer transition-colors">
                  Learn more about registration
                </span>
              </p>
            </div>
          </div>
          
          {/* Platform Highlights */}
          <div className="bg-gradient-to-br from-[#0D3B54]/10 to-[#1E3A4C]/10 rounded-xl p-4 md:p-6 space-y-3 md:space-y-4 border border-[#1E3A4C]/10">
            <div className="flex items-center space-x-3 text-[#1E3A4C]">
              <FaRocket className="text-xl md:text-2xl text-[#0D3B54]" />
              <h3 className="font-semibold text-sm md:text-base">Why Choose Us?</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <div className="flex flex-col items-center text-center group">
                <FaShieldAlt className="text-xl md:text-2xl mb-1 text-[#0D3B54]/70 group-hover:text-[#0D3B54] transition-colors" />
                <span className="text-2xs md:text-xs text-[#1E3A4C]/80">Secure</span>
              </div>
              <div className="flex flex-col items-center text-center group">
                <FaCloudUploadAlt className="text-xl md:text-2xl mb-1 text-[#0D3B54]/70 group-hover:text-[#0D3B54] transition-colors" />
                <span className="text-2xs md:text-xs text-[#1E3A4C]/80">Cloud-Based</span>
              </div>
              <div className="flex flex-col items-center text-center group">
                <FaCertificate className="text-xl md:text-2xl mb-1 text-[#0D3B54]/70 group-hover:text-[#0D3B54] transition-colors" />
                <span className="text-2xs md:text-xs text-[#1E3A4C]/80">Verified</span>
              </div>
            </div>
            <p className="text-2xs md:text-xs text-center text-[#1E3A4C]/80 italic">
              "Empowering your academic journey with technology"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
