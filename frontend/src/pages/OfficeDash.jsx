/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { 
  FaCertificate, FaUser, FaEdit, FaEye, FaCheck, 
  FaTimes, FaMoneyBillWave, FaPlus 
} from 'react-icons/fa'
import Navbar from '../components/Navbar'
import { UserData } from '../context/authContext'
const OfficeDash = ({user,userType}) => {
  // Students List State (simulating a database of students)
  const {isAuth} = UserData()
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'John Doe',
      enrollmentNo: 'CS2021001',
      department: 'Computer Science',
      email: 'john.doe@university.edu'
    },
    {
      id: 2,
      name: 'Jane Smith',
      enrollmentNo: 'EE2021002',
      department: 'Electrical Engineering',
      email: 'jane.smith@university.edu'
    }
  ])

  // Certificate Requests State
  const [certificateRequests, setCertificateRequests] = useState([
    {
      id: 1,
      studentName: 'John Doe',
      department: 'Computer Science',
      enrollmentNo: 'CS2021001',
      date: '2024-03-10',
      status: 'Pending',
      reason: 'Semester Completion'
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      department: 'Electrical Engineering',
      enrollmentNo: 'EE2021002',
      date: '2024-02-15',
      status: 'Pending',
      reason: 'Job Application'
    }
  ])

  // Dues Management State
  const [dues, setDues] = useState([
    {
      id: 1,
      studentId: 1,
      studentName: 'John Doe',
      department: 'Library',
      amount: 500,
      description: 'Annual Library Fee',
      status: 'Pending'
    },
    {
      id: 2,
      studentId: 2,
      studentName: 'Jane Smith',
      department: 'Hostel',
      amount: 2000,
      description: 'Semester Hostel Charges',
      status: 'Pending'
    }
  ])

  // Officer Profile State
  const [officerProfile, setOfficerProfile] = useState({
    name: 'Admin Officer',
    email: 'admin.officer@university.edu',
    department: 'Student Affairs',
    contactNo: '+91 9876543210'
  })

  // Profile Editing State
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState({ ...officerProfile })

  // Modal States
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [newDueModalOpen, setNewDueModalOpen] = useState(false)
  const [newDue, setNewDue] = useState({
    studentId: '',
    studentName: '',
    department: '',
    amount: '',
    description: ''
  })

  // Request Handling
  const handleApproveRequest = (request) => {
    const updatedRequests = certificateRequests.map(req => 
      req.id === request.id 
        ? { ...req, status: 'Approved', certificateUrl: '/generated-certificate.pdf' } 
        : req
    )
    setCertificateRequests(updatedRequests)
  }

  const handleRejectRequest = (request) => {
    const updatedRequests = certificateRequests.map(req => 
      req.id === request.id 
        ? { ...req, status: 'Rejected' } 
        : req
    )
    setCertificateRequests(updatedRequests)
  }

  // Profile Editing
  const handleProfileEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleProfileSave = () => {
    setOfficerProfile(editedProfile)
    setIsEditing(false)
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Dues Management
  const handleAddNewDue = (e) => {
    e.preventDefault()
    const selectedStudent = students.find(student => student.id === parseInt(newDue.studentId))
    
    if (!selectedStudent) {
      alert('Please select a valid student')
      return
    }

    const newDueItem = {
      id: dues.length + 1,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      department: newDue.department,
      amount: parseFloat(newDue.amount),
      description: newDue.description,
      status: 'Pending'
    }
    
    setDues([...dues, newDueItem])
    setNewDueModalOpen(false)
    setNewDue({
      studentId: '',
      studentName: '',
      department: '',
      amount: '',
      description: ''
    })
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Approved': return 'bg-green-100 text-green-800'
      case 'Rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
    <Navbar userType={userType} user={user} />
    <div className="min-h-screen bg-gradient-to-br from-[#E0E6E3] via-[#5A6D7C] to-[#0D3B54] p-8">
      <div className="container mx-auto grid grid-cols-3 gap-6">
        {/* Certificate Requests Section */}
        <div className="col-span-2 bg-white/80 rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-[#0D3B54] flex items-center mb-6">
            <FaCertificate className="mr-3 text-[#1E3A4C]" />
            Certificate Requests
          </h1>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0D3B54] text-white">
                <tr>
                  <th className="p-3">Student</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificateRequests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-[#E0E6E3]/50">
                    <td className="p-3">{request.studentName}</td>
                    <td className="p-3">{request.department}</td>
                    <td className="p-3">{request.date}</td>
                    <td className="p-3">{request.reason}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="p-3 flex space-x-2">
                      {request.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleApproveRequest(request)}
                            className="text-green-600 hover:text-green-800"
                            title="Approve Request"
                          >
                            <FaCheck />
                          </button>
                          <button 
                            onClick={() => handleRejectRequest(request)}
                            className="text-red-600 hover:text-red-800"
                            title="Reject Request"
                          >
                            <FaTimes />
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

        {/* Right Column - Profile and Dues */}
        <div className="col-span-1 space-y-6">
          {/* Officer Profile Section */}
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
                {Object.entries(officerProfile).map(([key, value]) => (
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

          {/* Dues Management Section */}
          <div className="bg-white/80 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0D3B54] flex items-center">
                <FaMoneyBillWave className="mr-3 text-[#1E3A4C]" />
                Dues Management
              </h2>
              <button 
                onClick={() => setNewDueModalOpen(true)}
                className="text-[#0D3B54] hover:text-[#1E3A4C] transition-colors"
                title="Add New Due"
              >
                <FaPlus />
              </button>
            </div>

            <div className="space-y-4">
              {dues.map((due) => (
                <div 
                  key={due.id} 
                  className="flex justify-between items-center border-b pb-3 last:border-b-0"
                >
                  <div>
                    <span className="font-medium text-[#0D3B54]">{due.studentName}</span>
                    <span className="block text-sm text-gray-600">{due.department} - {due.description}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#0D3B54]">₹{due.amount}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(due.status)}`}>
                      {due.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Due Modal */}
      {newDueModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h2 className="text-2xl font-bold text-[#0D3B54] mb-4">Add New Due</h2>
            <form onSubmit={handleAddNewDue} className="space-y-4">
              <div>
                <label 
                  htmlFor="studentId" 
                  className="block text-sm font-medium text-[#0D3B54] mb-2"
                >
                  Student
                </label>
                <select
                  id="studentId"
                  value={newDue.studentId}
                  onChange={(e) => {
                    const selectedStudent = students.find(s => s.id === parseInt(e.target.value))
                    setNewDue(prev => ({
                      ...prev, 
                      studentId: e.target.value,
                      studentName: selectedStudent ? selectedStudent.name : ''
                    }))
                  }}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0D3B54]/50"
                  required
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.enrollmentNo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label 
                  htmlFor="department" 
                  className="block text-sm font-medium text-[#0D3B54] mb-2"
                >
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  value={newDue.department}
                  onChange={(e) => setNewDue(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0D3B54]/50"
                  required
                />
              </div>
              <div>
                <label 
                  htmlFor="amount" 
                  className="block text-sm font-medium text-[#0D3B54] mb-2"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={newDue.amount}
                  onChange={(e) => setNewDue(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0D3B54]/50"
                  required
                />
              </div>
              <div>
                <label 
                  htmlFor="description" 
                  className="block text-sm font-medium text-[#0D3B54] mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={newDue.description}
                  onChange={(e) => setNewDue(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0D3B54]/50"
                  rows="3"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setNewDueModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0D3B54] text-white rounded-md hover:bg-[#1E3A4C]"
                >
                  Add Due
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default OfficeDash