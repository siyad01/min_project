/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const CertificateContext = createContext();

export const CertificateProvider = ({ children }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);

  async function createCertificate(formData) {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/certificates/create-certificate",
        formData
      );
      toast.success(data.message);

      // Show departments that will approve
      if (data.certificate.departments) {
        toast.success(
          `Certificate request submitted. Departments to approve: ${data.certificate.departments.join(
            ", "
          )}`
        );
      }
      setCertificates(prev => [data.certificate, ...prev]);
      setLoading(false);
      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to request certificate"
      );
      // If there are pending dues, show specific message
      if (error.response?.data?.pendingDues) {
        const pendingDues = error.response.data.pendingDues;
        toast.error(`You have ${pendingDues.length} pending dues`);

        // Show details of pending dues
        pendingDues.forEach((due) => {
          toast.error(`Pending Due: ${due.description} - ₹${due.amount}`);
        });
      }

      console.error("Certificate request error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }
  async function fetchAllMyCertRequests(studentId) {
    try {
      const { data } = await axios.get(`/api/certificates/${studentId}`);
      setCertificates(data.certificates);
      setLoading(false);
      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch certificate requests"
      );
    }
  }

  async function fetchAllCertRequests(officerId) {
    
    try {
      const { data } = await axios.get(`/api/certificates/all/${officerId}`);
      
      
      // Transform certificates to include necessary details
      

      setCertificates(data.certificates);
      setLoading(false);
      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch certificate requests"
      );
      console.error("Certificate fetch error:", error);
      setLoading(false);
      return [];
    }
  }

  async function getRequestStatus(certificateId) {
    try {
      const { data } = await axios.get(
        `/api/certificate/${certificateId}/status`
      );
      setCertificates(prev => prev.map(cert => cert._id === certificateId ? data.certificate : cert));
      setLoading(false);
      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch certificate request status"
      );
      setLoading(false);
    }
  }
  async function downloadCertificate(certificateId) {
    try {
      const { data } = await axios.get(
        `/api/certificate/${certificateId}/download`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate-${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setCertificates(prev => prev.map(cert => cert._id === certificateId ? data.certificate : cert));
      setLoading(false);
      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to download certificate"
      );
      setLoading(false);
    }
  }

  async function deleteCertificateRequest(certificateId) {
    try {
      setLoading(true);
      const { data } = await axios.delete(`/api/certificates/${certificateId}`);
      
      // Remove the deleted certificate from the list
      setCertificates(prev => prev.filter(cert => cert._id !== certificateId));
      
      toast.success(data.message);
      setLoading(false);
      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete certificate request"
      );
      setLoading(false);
      throw error;
    }
  }

  async function updateCertificateStatus(certificateId, statusData) {
    try {
      const { data } = await axios.put(`/api/certificates/${certificateId}/status`, statusData);
      
      // Update the local certificates state
      setCertificates(prev => 
        prev.map(cert => 
          cert._id === certificateId 
            ? { ...cert, status: statusData.status } 
            : cert
        )
      );
      
      toast.success(data.message || "Certificate status updated successfully");
      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update certificate status"
      );
      throw error;
    }
  }

  return (
    <CertificateContext.Provider
      value={{
        certificates,
        setCertificates,
        loading,
        createCertificate,
        fetchAllMyCertRequests,
        getRequestStatus,
        downloadCertificate,
        deleteCertificateRequest,
        fetchAllCertRequests,
        updateCertificateStatus
      }}
    >
      {children}
      <Toaster />
    </CertificateContext.Provider>
  );
};

export const CertificateData = () => useContext(CertificateContext);
