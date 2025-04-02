/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { FaCertificate, FaPlus, FaEye, FaUser, FaEdit, FaDownload, FaFileDownload ,FaMoneyBillWave, FaPaypal} from 'react-icons/fa'

const StudentDash = ({user}) => {
  // Certificate Requests State
  const [certificateRequests, setCertificateRequests] = useState([
    {
      id: 1,
      date: '2024-03-10',
      status: 'Pending',
      reason: 'Semester Completion',
      certificateUrl: null
    },
    {
      id: 2,
      date: '2024-02-15',
      status: 'Approved',
      reason: 'Job Application',
      certificateUrl: '/sample-certificate.pdf'
    }
  ])

  // Pending Dues State
  const [pendingDues, setPendingDues] = useState([
    {
      id: 1,
      department: 'Library',
      amount: 500,
      dueDate: '2024-04-15'
    },
    {
      id: 2,
      department: 'Hostel',
      amount: 2000,
      dueDate: '2024-03-30'
    },
    {
      id: 3,
      department: 'Tuition',
      amount: 15000,
      dueDate: '2024-04-01'
    }
  ])

  // Student Profile State
  const [studentProfile, setStudentProfile] = useState({
    name: user.firstName + ' ' + user.lastName,
    email: user.email,
    department: user.department,
    enrollmentNo: user.enrollmentNo,
    semester: user.semester,
    contactNo: user.contactNo
  })

  // Profile Editing State
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState({ ...studentProfile })

  // Payment State
  const [selectedDue, setSelectedDue] = useState(null)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  // New Request Modal State
  const [newRequestModalOpen, setNewRequestModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [certificateViewModalOpen, setCertificateViewModalOpen] = useState(false)
  const [newRequest, setNewRequest] = useState({
    reason: '',
    date: new Date().toISOString().split('T')[0]
  })

  // Handlers for New Request
  const handleNewRequest = (e) => {
    e.preventDefault()
    const requestToAdd = {
      id: certificateRequests.length + 1,
      date: newRequest.date,
      status: 'Pending',
      reason: newRequest.reason,
      certificateUrl: null
    }
    setCertificateRequests([...certificateRequests, requestToAdd])
    setNewRequestModalOpen(false)
    setNewRequest({ reason: '', date: new Date().toISOString().split('T')[0] })
  }

  // Handlers for Profile Editing
  const handleProfileEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleProfileSave = () => {
    setStudentProfile(editedProfile)
    setIsEditing(false)
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handlers for Certificate View and Download
  const handleViewCertificate = (request) => {
    setSelectedRequest(request)
    setCertificateViewModalOpen(true)
  }

  const handleDownloadCertificate = (certificateUrl) => {
    // In a real application, this would trigger a file download
    // For now, we'll simulate a download with an alert
    if (certificateUrl) {
      window.open(certificateUrl, '_blank')
    } else {
      alert('Certificate not available for download.')
    }
  }

  // Handlers for Payment
  const handlePayNow = (due) => {
    setSelectedDue(due)
    setPaymentModalOpen(true)
  }

  const handlePaymentConfirm = () => {
    // Simulate payment processing
    const updatedDues = pendingDues.filter(due => due.id !== selectedDue.id)
    setPendingDues(updatedDues)
    setPaymentModalOpen(false)
    setSelectedDue(null)
    // TODO: Integrate actual payment gateway
    alert(`Payment of ₹${selectedDue.amount} for ${selectedDue.department} successful!`)
  }

  // Other Handlers
  const handleViewStatus = (request) => {
    setSelectedRequest(request)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Approved': return 'bg-green-100 text-green-800'
      case 'Rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDueDateColor = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    return due < today ? 'text-red-600 font-bold' : 'text-gray-700'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0E6E3] via-[#5A6D7C] to-[#0D3B54] p-8">
      <div className="container mx-auto grid grid-cols-3 gap-6">
        {/* Certificate Requests Section - 2/3 width */}
        <div className="col-span-2 bg-white/80 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#0D3B54] flex items-center">
              <FaCertificate className="mr-3 text-[#1E3A4C]" />
              No Due Certificate Requests
            </h1>
            <button 
              onClick={() => setNewRequestModalOpen(true)}
              className="flex items-center space-x-2 bg-[#0D3B54] text-white px-4 py-2 rounded-md hover:bg-[#1E3A4C] transition-colors"
            >
              <FaPlus />
              <span>New Request</span>
            </button>
          </div>

          {/* Certificate Requests Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0D3B54] text-white">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificateRequests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-[#E0E6E3]/50">
                    <td className="p-3">{request.date}</td>
                    <td className="p-3">{request.reason}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="p-3 flex space-x-2">
                      <button 
                        onClick={() => handleViewStatus(request)}
                        className="text-[#0D3B54] hover:text-[#1E3A4C] flex items-center"
                      >
                        <FaEye className="mr-2" /> View
                      </button>
                      {request.status === 'Approved' && (
                        <>
                          <button 
                            onClick={() => handleViewCertificate(request)}
                            className="text-green-600 hover:text-green-800 flex items-center"
                          >
                            <FaCertificate className="mr-2" /> View Cert
                          </button>
                          <button 
                            onClick={() => handleDownloadCertificate(request.certificateUrl)}
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <FaDownload className="mr-2" /> Download
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Profile and Pending Dues */}
        <div className="col-span-1 space-y-6">
          {/* Student Profile Section */}
          <div className="bg-white/80 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0D3B54] flex items-center">
                <FaUser className="mr-3 text-[#1E3A4C]" />
                Profile
              </h2>
              <button 
                onClick={handleProfileEdit}
                className="text-[#0D3B54] hover:text-[#1E3A4C] transition-colors"
              >
                {isEditing ? 'Cancel' : <FaEdit />}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                {Object.entries(editedProfile).map(([key, value]) => (
                  <div key={key}>
                    <label 
                      htmlFor={key} 
                      className="block text-sm font-medium text-[#0D3B54] mb-1"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type="text"
                      id={key}
                      name={key}
                      value={value}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0D3B54]/50"
                    />
                  </div>
                ))}
                <button
                  onClick={handleProfileSave}
                  className="w-full py-3 rounded-xl bg-[#0D3B54] text-white font-semibold 
                    hover:bg-[#1E3A4C] focus:outline-none focus:ring-2 focus:ring-[#0D3B54] 
                    focus:ring-opacity-50 transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(studentProfile).map(([key, value]) => (
                  <div key={key} className="border-b pb-2 last:border-b-0">
                    <span className="text-[#0D3B54] font-medium">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
                    </span>
                    <span className="ml-2 text-[#1E3A4C]">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Dues Section */}
          <div className="bg-white/80 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0D3B54] flex items-center">
                <FaMoneyBillWave className="mr-3 text-[#1E3A4C]" />
                Pending Dues
              </h2>
            </div>

            <div className="space-y-4">
              {pendingDues.map((due) => (
                <div 
                  key={due.id} 
                  className="flex justify-between items-center border-b pb-3 last:border-b-0"
                >
                  <div>
                    <span className="font-medium text-[#0D3B54]">{due.department}</span>
                    <span className={`block text-sm ${getDueDateColor(due.dueDate)}`}>
                      Due: {due.dueDate}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-[#0D3B54]">₹{due.amount}</span>
                    <button
                      onClick={() => handlePayNow(due)}
                      className="bg-[#0D3B54] text-white px-3 py-1 rounded-md hover:bg-[#1E3A4C] transition-colors flex items-center"
                    >
                      <FaPaypal className="mr-2" /> Pay Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Existing Modals (New Request, Request Status) from previous implementation */}
      {/* New Request Modal */}
      {newRequestModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h2 className="text-2xl font-bold text-[#0D3B54] mb-4">New Certificate Request</h2>
            <form onSubmit={handleNewRequest} className="space-y-4">
              <div>
                <label 
                  htmlFor="reason" 
                  className="block text-sm font-medium text-[#0D3B54] mb-2"
                >
                  Reason for Certificate
                </label>
                <textarea
                  id="reason"
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest(prev => ({
                    ...prev,
                    reason: e.target.value
                  }))}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0D3B54]/50"
                  rows="4"
                  placeholder="Enter reason for certificate request"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setNewRequestModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0D3B54] text-white rounded-md hover:bg-[#1E3A4C]"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Status Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h2 className="text-2xl font-bold text-[#0D3B54] mb-4">Request Status</h2>
            <div className="space-y-4">
              <div>
                <span className="font-medium text-[#0D3B54]">Date:</span>
                <span className="ml-2">{selectedRequest.date}</span>
              </div>
              <div>
                <span className="font-medium text-[#0D3B54]">Reason:</span>
                <span className="ml-2">{selectedRequest.reason}</span>
              </div>
              <div>
                <span className="font-medium text-[#0D3B54]">Status:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm ${getStatusColor(selectedRequest.status)}`}>
                  {selectedRequest.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-full py-2 bg-[#0D3B54] text-white rounded-md hover:bg-[#1E3A4C]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModalOpen && selectedDue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h2 className="text-2xl font-bold text-[#0D3B54] mb-4">Confirm Payment</h2>
            <div className="space-y-4">
              <div>
                <span className="font-medium text-[#0D3B54]">Department:</span>
                <span className="ml-2">{selectedDue.department}</span>
              </div>
              <div>
                <span className="font-medium text-[#0D3B54]">Amount:</span>
                <span className="ml-2 font-bold text-green-600">₹{selectedDue.amount}</span>
              </div>
              <div>
                <span className="font-medium text-[#0D3B54]">Due Date:</span>
                <span className="ml-2">{selectedDue.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentConfirm}
                  className="px-4 py-2 bg-[#0D3B54] text-white rounded-md hover:bg-[#1E3A4C] flex items-center"
                >
                  <FaPaypal className="mr-2" /> Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate View Modal */}
      {certificateViewModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[600px] max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#0D3B54]">Certificate Details</h2>
              <button
                onClick={() => setCertificateViewModalOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="font-medium text-[#0D3B54]">Request Date:</span>
                <span className="ml-2">{selectedRequest.date}</span>
              </div>
              <div>
                <span className="font-medium text-[#0D3B54]">Reason:</span>
                <span className="ml-2">{selectedRequest.reason}</span>
              </div>
              <div>
                <span className="font-medium text-[#0D3B54]">Status:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm ${getStatusColor(selectedRequest.status)}`}>
                  {selectedRequest.status}
                </span>
              </div>
              {selectedRequest.certificateUrl ? (
                <div className="mt-4">
                  <iframe 
                    src={selectedRequest.certificateUrl} 
                    className="w-full h-[400px] border rounded-lg"
                    title="Certificate Preview"
                  />
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => handleDownloadCertificate(selectedRequest.certificateUrl)}
                      className="bg-[#0D3B54] text-white px-4 py-2 rounded-md hover:bg-[#1E3A4C] flex items-center"
                    >
                      <FaFileDownload className="mr-2" /> Download Certificate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-600 mt-4">
                  Certificate not yet available for viewing.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentDash