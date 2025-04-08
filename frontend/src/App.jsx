/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import AdminLogin from "./pages/AdminLogin.jsx";

const App = () => {
  const { setUser, setIsAuth, loading, isAuth, loginAdmin, loginStudent, loginOfficer, logout } = UserData();
  const [localUser, setLocalUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);



  const getUserRole = useCallback((user) => {
    if (!user) return null;
    
    if (user.userType === 'Admin') return 'Admin';
    if (user.semester) return 'Student';
    if (user.department) return 'Officer';
    
    return null;
  }, []);

  // Check authentication on initial load
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        if (!token) {
          if (isMounted) {
            setIsAuth(false);
            setUser(null);
            setAuthLoading(false);
          }
          return;
        }

        const { data } = await axios.get("/api/authentication/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (isMounted) {
          const userRole = getUserRole(data.user);
          
          setUser(data.user);
          setLocalUser(data.user);
          setIsAuth(true);
          setUserType(userRole);
        }
      } catch (error) {
        console.error("Token Validation Error:", error);
        
        if (isMounted) {
          localStorage.removeItem("authToken");
          setIsAuth(false);
          setUser(null);
          setUserType(null);
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };

    checkAuth();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Memoize context value to prevent unnecessary re-renders
  const authContextValue = useMemo(() => ({
    isAuth,
    user: localUser,
    userType,
    loginAdmin,
    loginStudent,
    loginOfficer,
    logout,
    loading
  }), [isAuth, localUser, userType, loading]);

  // Show loading screen until the auth status is known
  if (authLoading || loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      {isAuth && userType ? <Navbar userType={userType} user={localUser} /> : <Navbar user={localUser} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/admin-dash" 
          element={
            isAuth && userType === "Admin" ? <AdminPage /> : <AdminLogin />
          } 
        />
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
        
        <Route path="/login" element={<Login />} />
        <Route 
          path="/login-admin" 
          element={
            isAuth && userType === "Admin" ? <Navigate to="/admin-dash"/> : <AdminLogin />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
