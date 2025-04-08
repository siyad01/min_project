// db/models/dueModel.js
import mongoose from 'mongoose';

const dueSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  officeStaffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Officer',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  department: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  },
  paidAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

const Due = mongoose.model('Due', dueSchema);

export default Due;
