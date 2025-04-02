/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaCertificate } from "react-icons/fa";
import { UserData } from "../context/authContext";
import toast from 'react-hot-toast'; // Import toast

const StudentRegister = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [semester, setSemester] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const { registerStudent } = UserData();

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // Ensure all steps are completed before submission
    if (step !== 3) {
      toast.error("Please complete all registration steps");
      return;
    }

    // Validate all required fields
    if (!firstName || !lastName || !email || !password || 
        !department || !semester || !phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Set loading state
    setBtnLoading(true);

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("department", department);
    formData.append("semester", semester);
    formData.append("phone", phone);

    // Log FormData contents for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    // Attempt registration and handle loading state
    registerStudent(formData)
      .then(() => {
        // Registration successful
        toast.success("Registration successful!");
      })
      .catch((error) => {
        // Registration failed
        toast.error(error.response?.data?.message || "Registration failed");
      })
      .finally(() => {
        // Reset loading state
        setBtnLoading(false);
      });
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
          Student Registration
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
                  College Email
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
              {/* <div className="mb-4">
                <label
                  htmlFor="rollNumber"
                  className="block text-sm font-medium mb-2 text-[#0D3B54]"
                >
                  Roll Number
                </label>
                <input
                  type="text"
                  id="rollNumber"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0D3B54]/50"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  required
                />
              </div> */}

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
                  <option value="CSE">Computer Science</option>
                  <option value="ECE">Electronics</option>
                  <option value="MECH">Mechanical</option>
                  <option value="CIVIL">Civil</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="sem"
                  className="block text-sm font-medium mb-2 text-[#0D3B54]"
                >
                  Semester
                </label>
                <select
                  id="sem"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0D3B54]/50"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                    <option key={semester} value={semester}>
                      Semester {semester}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-2 text-[#0D3B54]"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0D3B54]/50"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-between space-x-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/2 py-3 rounded-xl border border-[#0D3B54] text-[#0D3B54] 
                    hover:bg-[#0D3B54]/10 transition-all duration-300"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-1/2 py-3 rounded-xl bg-[#0D3B54] text-white font-semibold 
                    hover:bg-[#1E3A4C] focus:outline-none focus:ring-2 focus:ring-[#0D3B54] 
                    focus:ring-opacity-50 transition-all duration-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-center text-[#1E3A4C]">
                Review Your Information
              </h3>
              <div className="space-y-2 mb-4 bg-[#0D3B54]/5 p-4 rounded-xl">
                <p>
                  <strong className="text-[#0D3B54]">Name:</strong> {firstName}{" "}
                  {lastName}
                </p>
                <p>
                  <strong className="text-[#0D3B54]">Email:</strong> {email}
                </p>
                {/* <p>
                  <strong className="text-[#0D3B54]">Roll Number:</strong>{" "}
                  {rollNumber}
                </p> */}
                <p>
                  <strong className="text-[#0D3B54]">Department:</strong>{" "}
                  {department}
                </p>
                <p>
                  <strong className="text-[#0D3B54]">Semester:</strong> {semester}
                </p>
                <p>
                  <strong className="text-[#0D3B54]">Phone:</strong> {phone}
                </p>
              </div>

              <div className="flex justify-between space-x-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/2 py-3 rounded-xl border border-[#0D3B54] text-[#0D3B54] 
                    hover:bg-[#0D3B54]/10 transition-all duration-300"
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

export default StudentRegister;
