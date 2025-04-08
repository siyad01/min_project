/* eslint-disable react/prop-types */
import axios from "axios"
import {createContext, useContext, useState } from "react"
import toast, {Toaster} from "react-hot-toast"

const AuthContext = createContext();


export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAuth, setIsAuth] = useState(false);

    async function registerStudent(formData) {
        try {
           
            // Add axios configuration for multipart form data
            const { data } = await axios.post("/api/auth/register-student", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success(data.message);
            setUser(data.student);
            setIsAuth(true);
            setLoading(false);
            localStorage.setItem("authToken", data.token);
            window.location.reload();
            return data;
        } catch (error) {
            // Detailed error logging
            console.error("Registration Error:", {
                message: error.response?.data?.message,
                status: error.response?.status,
                data: error.response?.data,
                fullError: error
            });

            // More specific error toast
            toast.error(
                error.response?.data?.message || 
                error.message || 
                "Registration failed. Please try again."
            );
            
            setLoading(false);
            throw error; // Re-throw to allow caller to handle if needed
        }
    }

    async function registerOfficer(formData) {
        try {
            const { data } = await axios.post("/api/auth/register-officer", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                  },
            });
            toast.success(data.message);
            setUser(data.officer);
            setIsAuth(true);
            setLoading(false);
            localStorage.setItem("authToken", data.token);
            window.location.reload();
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
            setLoading(false);
        }
    }


    async function loginStudent(email, password) {
        try {
            const { data } = await axios.post("/api/auth/login-student", { email, password });
            toast.success(data.message);
            setUser(data.student);
            setIsAuth(true);
            setLoading(false);
            localStorage.setItem("authToken", data.token);
            window.location.reload();
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            setLoading(false);
        }
    }

    async function loginOfficer(email, password) {
        try {
            const { data } = await axios.post("/api/auth/login-officer", { email, password });
            toast.success(data.message);
            setUser(data.officer);
            setIsAuth(true);
            setLoading(false);
            localStorage.setItem("authToken", data.token);
            window.location.reload();
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            setLoading(false);
        }
    }

    async function loginAdmin(email, password) {
        try {
            const { data } = await axios.post("/api/auth/login-admin", { email, password });
            toast.success(data.message);
            setUser(data.admin);
            setIsAuth(true);
            setLoading(false);
            localStorage.setItem("authToken", data.token);
            window.location.reload();
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            setLoading(false);
        }
    }

    async function logout() {
        try {
            await axios.post("/api/auth/logout");
            toast.success("Logout successful");
            setUser(null);
            setIsAuth(false);
            localStorage.removeItem("authToken");
            
            setLoading(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
            setLoading(false);
        }
    }

    async function updateStudentProfile(formData) {
        try {
            setLoading(true);
            const { data } = await axios.put("/api/auth/update-student-profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success(data.message);
            setUser(data.student);  // Update user in context
            setLoading(false);
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Profile update failed");
            setLoading(false);
            throw error;
        }
    }

    async function updateOfficerProfile(formData) {
        try {
            setLoading(true);
            const { data } = await axios.put("/api/auth/update-officer-profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success(data.message);
            setUser(data.officer);  // Update user in context
            setLoading(false);
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Profile update failed");
            setLoading(false);
            throw error;
        }
    }

    async function fetchStudentDetails() {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/auth/student-details");
            
            // Update user details in context
            setUser(data.student);
            setLoading(false);
            return data.student;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch student details");
            setLoading(false);
            throw error;
        }
    }

    async function fetchOfficerDetails() {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/auth/officer-details");
            
            // Update user details in context
            setUser(data.officer);
            setLoading(false);
            return data.officer;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch officer details");
            setLoading(false);
            throw error;
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuth,
            setIsAuth,
            setUser,
            registerStudent,
            registerOfficer,
            loginStudent,
            loginOfficer,
            loginAdmin,
            logout,
            updateStudentProfile,
            updateOfficerProfile,
            fetchStudentDetails,
            fetchOfficerDetails,
            
        }}>
            {children}
            <Toaster />
        </AuthContext.Provider>
    )
};

export const UserData = () => useContext(AuthContext);
