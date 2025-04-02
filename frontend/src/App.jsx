/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home.jsx";
import StudentRegister from "./pages/StudentRegister.jsx";
import Login from "./pages/Login.jsx";
import OfficeRegister from "./pages/OfficeRegister.jsx";
import StudentDash from "./pages/StudentDash.jsx";
import OfficeDash from "./pages/OfficeDash.jsx";
import Navbar from "./components/Navbar.jsx";
import { UserData } from "./context/authContext";
import AdminPage from "./pages/AdminPage.jsx";
import { Loading } from "./components/Loading.jsx";
const App = () => {
  const { setUser, setIsAuth, loading, isAuth } = UserData();
  const [localUser, setLocalUser] = useState(null);
    const [userType, setUserType] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // State to manage auth loading

  // Office departments list to match Navbar logic
  const officeDepartments = [
    "Office",
    "Library",
    "Hostel",
    "Canteen",
    "Co-op Store",
    "Placement & Training Cell",
    "Sports Department",
    "CSE Department Labs",
    "ECE Department Labs",
    "Civil Department Labs",
    "EEE Department Labs",
    "College Bus",
    "Class Tutor",
  ];

  // User role detection method matching Navbar
  const getUserRole = (user) => {
    // Check if user has semester (student)
    if (user?.semester) {
      setUserType("Student");
      return "Student";
    }

    // Check if user has department from office staff list
    if (user?.department && officeDepartments.includes(user.department)) {
      setUserType(`${user.department} Staff`);
      return `${user.department} Staff`;
    }

    // Check for admin role
    if (user?.role === "admin") {
      setUserType("Admin");
      return "Admin";
    }

    // Fallback
    return "User";
  };

  // Check authentication on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      console.log(token);
      

      if (token) {
        // Fetch user details to verify token
        try {
          const { data } = await axios.get("/api/authentication/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(getUserRole(data.user)); // Set the authenticated user
          setLocalUser(data.user);
          setIsAuth(true); // Set auth status to true
        } catch (error) {
          console.error("Token validation failed", error);
          localStorage.removeItem("authToken"); // Remove invalid token
          setIsAuth(false); // Set auth status to false
        }
      } else {
        setIsAuth(false); // No token means no authentication
      }
      setAuthLoading(false); // Stop showing the loading animation
    };

    checkAuth();
  }, [setIsAuth, setUser]);

    // Show loading screen until the auth status is known
    if (authLoading || loading) {
      return <Loading />;
    }

  return (
    <BrowserRouter>
      {isAuth && userType==="Student"? <Navbar userType={userType} user={localUser} /> : null}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/student-register"
          element={
            isAuth ? <Navigate to="/student-dash" /> : <StudentRegister />
          }
        />
        <Route
          path="/office-register"
          element={isAuth ? <Navigate to="/office-dash" /> : <OfficeRegister />}
        />
        <Route
          path="/student-dash"
          element={isAuth ? <StudentDash user={localUser}/> : <Login />}
        />
        <Route
          path="/office-dash"
          element={isAuth ? <OfficeDash user={localUser} userType={userType}/> : <Login />}
        />
        <Route path="/admin" element={isAuth ? <AdminPage /> : <Login />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
