/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios"
import { createContext, useContext, useState } from "react"
import toast, { Toaster } from "react-hot-toast";

const DueContext = createContext();

export const DueProvider = ({children}) => {
    const [dues, setDues] = useState([]);
    const [loading, setLoading] = useState(false)
    const [isDue, setIsDue] = useState(false)

    const [due, setDue] = useState(null);
    async function createDue(formData){
    
        try {
            const {data} = await axios.post("/api/dues/reg-due", formData,{
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success(data.message);
            setDues(prevDues => [...prevDues, data.due]);
            setIsDue(true);
            setLoading(false);
            return data;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Registration failed");
            setLoading(false);
        }
    }
    async function fetchAllDues(){
        try {
            const { data } = await axios.get(`/api/dues/`);
            setDues(data.dues);
            setIsDue(data.dues.length > 0);
            setLoading(false);
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch dues");
            setLoading(false);
        }
    }
    async function fetchStudentDues(studentId){
        try {
            const { data } = await axios.get(`/api/dues/${studentId}`);
            setDues(data.dues);
            setIsDue(true);
            setLoading(false);
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch dues");
            setLoading(false);
        }
    }

    
    async function setDueStatus(dueId, status) {
        try {
            const { data } = await axios.put(`/api/dues/${dueId}/status`, { status });
            toast.success(data.message);
            setDues(prevDues => 
                prevDues.map(due => 
                  due._id === dueId ? data.due : due
                )
              );            setIsDue(false);
            setLoading(false);
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to set due status");
            setLoading(false);
        }
    }

    async function deleteDue(dueId){
        try {
            const { data } = await axios.delete(`/api/dues/${dueId}`);
            toast.success(data.message);
            setDues(prevDues => 
                prevDues.filter(due => due._id !== dueId)
              );
            setIsDue(false);
            setLoading(false);
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete due");
            setLoading(false);
        }
    }

    async function requestCashPayment(dueId){
        try {
            const { data } = await axios.post(`/api/dues/${dueId}/cash-payment`);
            toast.success(data.message);
            setIsDue(false);
            setLoading(false);
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to request cash payment");
            setLoading(false);
        }
    }








    return (
        <DueContext.Provider value={{
            dues,
            due,
            loading,
            isDue,
            createDue,
            fetchAllDues,
            fetchStudentDues,
            setDueStatus,
            deleteDue,
            requestCashPayment
        }}>
            {children}
            <Toaster />
        </DueContext.Provider>
    )
}

export const DueData = () => useContext(DueContext);
