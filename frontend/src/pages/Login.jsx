/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import { UserData } from "../context/authContext.jsx";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginStudent, loginOfficer, loginAdmin } = UserData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let loginFunction;
      switch (userType) {
        case "student":
          loginFunction = loginStudent;
          break;
        case "office":
          loginFunction = loginOfficer;
          break;
        case "admin":
          loginFunction = loginAdmin;
          break;
        default:
          throw new Error("Invalid user type");
      }

      loginFunction(email, password);
      
      // Navigate based on user type
      switch (userType) {
        case "student":
          navigate("/student-dash");
          break;
        case "office":
          navigate("/office-dash");
          break;
        case "admin":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      console.error("Login error", err);
    } finally {
      setLoading(false);
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
          Login
        </h2>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label
              htmlFor="userType"
              className="block text-sm font-medium mb-2 text-[#0D3B54]"
            >
              Login As
            </label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0D3B54]/50"
            >
              <option value="student">Student</option>
              <option value="office">Office Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 text-[#0D3B54]"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0D3B54]/50"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0D3B54]/50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#0D3B54] text-white font-semibold 
              hover:bg-[#1E3A4C] focus:outline-none focus:ring-2 focus:ring-[#0D3B54] 
              focus:ring-opacity-50 transition-all duration-300 flex items-center justify-center"
          >
            {loading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <FaSignInAlt className="mr-2" />
                Login
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#1E3A4C]/70">
            Don't have an account?{" "}
            <Link
              to="/student-register"
              className="font-bold text-[#0D3B54] hover:underline"
            >
              Register as Student
            </Link>{" "}
            or{" "}
            <Link
              to="/office-register"
              className="font-bold text-[#0D3B54] hover:underline"
            >
              Register as Office Staff
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
