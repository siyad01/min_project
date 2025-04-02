/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCertificate } from "react-icons/fa";
import { UserData } from "../context/authContext.jsx";


const OfficeRegister = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department, setDepartment] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();
  const { registerOfficer } = UserData();

  const handleNextStep = () => {
    // Validate first step inputs
    if (!firstName || !lastName || !email || !password) {
      console.error("Please fill in all fields");
      return;
    }

    // Password validation
    if (password.length < 6) {
      console.error("Password must be at least 6 characters long");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Please enter a valid email address");
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

    // Password confirmation check
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
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
      registerOfficer(formData);

      // Show success toast and navigate to login
      
    } catch (error) {
      console.error("Office Registration error", error);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0E6E3] via-[#5A6D7C] to-[#0D3B54] p-4 sm:p-8 overflow-hidden">
      <div className="bg-white/90 p-10 rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            <img
              src="/logo1.png"
              alt="No Due Certificate Generator"
              className="h-16 w-16 md:h-24 md:w-24 object-contain"
            />
            <h1 className="text-2xl md:text-4xl font-extrabold text-[#1E3A4C] font-sans tracking-tight leading-tight">
              No Due Certificate Generator
            </h1>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-[#1E3A4C]">
          Office Staff Registration
        </h2>

        <form onSubmit={submitHandler}>
          {step === 1 && (
            <div>
              <div className="flex space-x-4 mb-4">
                <div className="w-1/2">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium mb-2 text-[#0D3B54]"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0D3B54]/50"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium mb-2 text-[#0D3B54]"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0D3B54]/50"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-[#0D3B54]"
                >
                  Official Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0D3B54]/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2 text-[#0D3B54]"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0D3B54]/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2 text-[#0D3B54]"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0D3B54]/50"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full py-3 rounded-xl bg-[#0D3B54] text-white font-semibold 
                  hover:bg-[#1E3A4C] focus:outline-none focus:ring-2 focus:ring-[#0D3B54] 
                  focus:ring-opacity-50 transition-all duration-300"
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mb-4">
                <label
                  htmlFor="department"
                  className="block text-sm font-medium mb-2 text-[#0D3B54]"
                >
                  Department
                </label>
                <select
                  id="department"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0D3B54]/50"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Office">Office</option>
                  <option value="Library">Library</option>
                  <option value="Hostel">Hostel (if applicable)</option>
                  <option value="Canteen">Canteen</option>
                  <option value="Co-op Store">Co-op Store</option>
                  <option value="Sports Department">Sports Department</option>
                  <option value="Placement & Training Cell">Placement & Training Cell</option>
                  <option value="CSE Department Labs">CSE Department Labs</option>
                  <option value="ECE Department Labs">ECE Department Labs</option>
                  <option value="Civil Department Labs">Civil Department Labs</option>
                  <option value="EEE Department Labs">EEE Department Labs</option>
                  <option value="College Bus">College Bus</option>
                  <option value="Class Tutor">Class Tutor</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/2 py-3 rounded-xl border border-[#0D3B54] text-[#0D3B54] font-semibold 
                    hover:bg-[#0D3B54]/10 focus:outline-none focus:ring-2 focus:ring-[#0D3B54] 
                    focus:ring-opacity-50 transition-all duration-300"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-xl bg-[#0D3B54] text-white font-semibold 
                    hover:bg-[#1E3A4C] focus:outline-none focus:ring-2 focus:ring-[#0D3B54] 
                    focus:ring-opacity-50 transition-all duration-300"
                  disabled={btnLoading}
                >
                  {btnLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#1E3A4C]/70">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-[#0D3B54] hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfficeRegister;