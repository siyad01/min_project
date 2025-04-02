// db/models/dueModel.js
import mongoose from 'mongoose';

const dueSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  officeStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
    enum: ['Pending', 'Paid', 'Cancelled'],
    default: 'Pending'
  },
  paymentDetails: {
    transactionId: String,
    paymentDate: Date
  }
}, { timestamps: true });

const Due = mongoose.model('Due', dueSchema);

// Static methods for easier importing
export const create = (data) => Due.create(data);
export const findById = (id) => Due.findById(id);
export const find = (query) => Due.find(query);
export const findOne = (query) => Due.findOne(query);
export const findByIdAndUpdate = (id, update, options) => Due.findByIdAndUpdate(id, update, options);

export default Due;