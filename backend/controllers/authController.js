// controllers/authController.js
import bcrypt from "bcryptjs";
import CustomError from '../middlewares/customError.js';
import { Student } from '../db/models/studentModel.js';
import TryCatch from "../utils/TryCatch.js";
import generateToken from "../utils/generateToken.js";
import { Officer } from "../db/models/officeModel.js";
import { Admin } from "../db/models/adminModel.js";

export const registerStudent = TryCatch(async (req, res) => {
  const { firstName, lastName, email, password, department, semester, phone,admissionNo } = req.body;

  
  // Validate input fields
  if (!firstName || !lastName || !email || !password || !department || !semester || !phone) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  let student = await Student.findOne({ email });
  if (student) {
    return res.status(400).json({
      message: "An account with this email already exists",
    });
  }

  // Hash the password
  const hashPassword = await bcrypt.hash(password, 10);

  student = await Student.create({
    firstName,
    lastName,
    email,
    password: hashPassword,
    department,
    semester,
    phone,
    admissionNo
  });

   // Generate and send the token (assuming you have a function for this)
   generateToken(student._id, res);

   res.status(201).json({
     student,
     message: "Student registered successfully from backend",
   });
})


export const loginStudent = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  let student = await Student.findOne({ email });

  if (!student)
    return res.status(400).json({
      message: "No student with this mail",
    });

  const comparePassword = await bcrypt.compare(password, student.password);

  if (!comparePassword)
    return res.status(400).json({
      message: "Wrong password",
    });

  const token = generateToken(student._id, res);

  res.json({
    student,
    token,  
    message: "Logged in",
  });
});

export const registerOfficer = TryCatch(async (req, res) => {
  const {  firstName, lastName, email, password, department } = req.body;

  

  let officer = await Officer.findOne({ email });
  if (officer) {
    return res.status(400).json({
      message: "An account with this email already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  // Create user
  officer = await Officer.create({
    firstName,
    lastName, 
    email,
    password: hashPassword,
    department,
  });

  // Generate and send the token (assuming you have a function for this)
  generateToken(officer._id, res);

  res.status(201).json({
    officer,
    message: "Officer registered successfully",
  });
});

export const regAdmin = TryCatch(async (req, res) => {
  const {email,password} = req.body;
  


  let admin = await Admin.findOne({ email });
  if (admin) {
    return res.status(400).json({
      message: "An account with this email already exists",
    });
  }

  // Await the hash operation
  const hashPassword = await bcrypt.hash(password, 10);

  // Create user
  admin = await Admin.create({
    email,
    password: hashPassword,
  });

  // Generate and send the token (assuming you have a function for this)
  generateToken(admin._id, res);

  res.status(201).json({
    admin,
    message: "Admin registered successfully",
  });
});

export const loginOfficer = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const officer = await Officer.findOne({ email });
  
  if (!officer)
    return res.status(400).json({
      message: "No officer with this mail",
    });

  const comparePassword = await bcrypt.compare(password, officer.password);

  if (!comparePassword)
    return res.status(400).json({
      message: "Wrong password",
    });

  const token = generateToken(officer._id, res);

  res.json({
    officer,
    token,  
    message: "Logged in",
  });
});

export const login = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new CustomError('Please provide email and password', 400));
  }

  // Find user and select password
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin) {
    return next(new CustomError('Invalid credentials', 401));
  }

  const comparePassword = await bcrypt.compare(password, admin.password);

  if (!comparePassword)
    return res.status(400).json({
      message: "Wrong password",
    });

  const token = generateToken(admin._id, res);
  
  res.json({
    admin,
    token,  
    message: "Logged in",
  });
});


export const logout = TryCatch(async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.json({ message: "Logged out" });
});

export const updateStudentProfile = TryCatch(async (req, res) => {
  const studentId = req.user._id;
  const updateData = req.body;

  // Validation to prevent email change
  if (updateData.email) {
    return res.status(400).json({
      message: "Email cannot be changed"
    });
  }

  // Fields that can be updated
  const allowedFields = [
    'firstName', 
    'lastName', 
    'phone', 
    'semester', 
  ];

  // Filter out any unauthorized fields
  const validUpdateData = {};
  Object.keys(updateData).forEach(key => {
    if (allowedFields.includes(key)) {
      validUpdateData[key] = updateData[key];
    }
  });

  // Update the student
  const student = await Student.findByIdAndUpdate(
    studentId, 
    validUpdateData, 
    { 
      new: true,  // Return the updated document
      runValidators: true  // Run model validation
    }
  );

  if (!student) {
    return res.status(404).json({
      message: "Student not found"
    });
  }

  res.status(200).json({
    student,
    message: "Profile updated successfully"
  });
});

export const fetchStudentDetails = TryCatch(async (req, res) => {
  const studentId = req.user._id;

  const student = await Student.findById(studentId).select(
    '-password -__v'  // Exclude sensitive fields
  );

  if (!student) {
    return res.status(404).json({
      message: "Student not found"
    });
  }

  res.status(200).json({
    student,
    message: "Student details fetched successfully"
  });
});

export const updateOfficerProfile = TryCatch(async (req, res) => {
  const officerId = req.user._id;
  const updateData = req.body;

  // Validation to prevent email change
  if (updateData.email) {
    return res.status(400).json({
      message: "Email cannot be changed"
    });
  }

  // Fields that can be updated
  const allowedFields = [
    'firstName', 
    'lastName', 
    'email', 
  ];

  // Filter out any unauthorized fields
  const validUpdateData = {};
  Object.keys(updateData).forEach(key => {
    if (allowedFields.includes(key)) {
      validUpdateData[key] = updateData[key];
    }
  });

  // Update the officer
  const officer = await Officer.findByIdAndUpdate(
    officerId, 
    validUpdateData, 
    { 
      new: true,  // Return the updated document
      runValidators: true  // Run model validation
    }
  );

  if (!officer) {
    return res.status(404).json({
      message: "Officer not found"
    });
  }

  res.status(200).json({
    officer,
    message: "Profile updated successfully"
  });
});

export const fetchOfficerDetails = TryCatch(async (req, res) => {
  const officerId = req.user._id;

  const officer = await Officer.findById(officerId).select(
    '-password -__v'  // Exclude sensitive fields
  );

  if (!officer) {
    return res.status(404).json({
      message: "Officer not found"
    });
  }

  res.status(200).json({
    officer,
    message: "Officer details fetched successfully"
  });
});