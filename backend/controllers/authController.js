// controllers/authController.js
import bcrypt from "bcryptjs";
import CustomError from '../middlewares/customError.js';
import { Student } from '../db/models/studentModel.js';
import TryCatch from "../utils/TryCatch.js";
import generateToken from "../utils/generateToken.js";
import { Officer } from "../db/models/officeModel.js";
import { Admin } from "../db/models/adminModel.js";

export const registerStudent = TryCatch(async (req, res) => {
  const { firstName, lastName, email, password, department, semester, phone } = req.body;
  // Remove console logs in production
  console.log("Full Request Body:", req.body);

  
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
    phone
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

  generateToken(student._id, res);

  res.json({
    student,
    message: "Logged in",
  });
});

export const registerOfficer = TryCatch(async (req, res) => {
  const {  firstName, lastName, email, password, department } = req.body;

  // Check if user already exists
  console.log("reigstere officer called");
  
  console.log("Full Request Body:", req.body);

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

export const loginOfficer = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const officer = await Officer.findOne({ email });

  console.log(req.body);
  
  console.log(officer);
  
  if (!officer)
    return res.status(400).json({
      message: "No officer with this mail",
    });

  const comparePassword = await bcrypt.compare(password, officer.password);

  if (!comparePassword)
    return res.status(400).json({
      message: "Wrong password",
    });

  generateToken(officer._id, res);

  res.json({
    officer,
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

  // Check password
  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return next(new CustomError('Invalid credentials', 401));
  }

  
  generateToken(admin._id, res);

  res.json({
    admin,
    message: "Logged in",
  });
});


export const logout = TryCatch(async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.json({ message: "Logged out" });
});