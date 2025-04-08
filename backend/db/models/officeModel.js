import mongoose from "mongoose";

const officeSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
  },
  department: {
    type: String,
    required: [true, "Please provide a department"],
    enum: [
      'Office', 
      'Library',
      'College Bus', 
      'Class Tutor'
    ]
  }
}, { timestamps: true });

export const Officer = mongoose.model("Officer", officeSchema)