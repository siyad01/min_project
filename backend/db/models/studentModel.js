import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  admissionNo: {
    type: String,
    required: [true, "Please provide a student number"],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  semester: {
    type: Number,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    match: [/^[6-9]\d{9}$/, 'Please provide a valid mobile number']
  },

}, { timestamps: true });


export const Student = mongoose.model("Student", studentSchema)
