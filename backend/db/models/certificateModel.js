import { Schema, model } from 'mongoose';

const certificateSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  officeApprovals: [{
    office: {
      type: Schema.Types.ObjectId,
      ref: 'Office',
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    remarks: {
      type: String,
      default: ''
    },
    approvedAt: {
      type: Date
    }
  }],
  isFullyApproved: {
    type: Boolean,
    default: false
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  },
  certificateNumber: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['In Progress', 'Issued', 'Rejected'],
    default: 'In Progress'
  }
}, { timestamps: true });

// Generate unique certificate number
certificateSchema.pre('save', function(next) {
  if (!this.certificateNumber) {
    const prefix = 'NDC';
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 7);
    this.certificateNumber = `${prefix}-${timestamp}-${randomStr}`.toUpperCase();
  }
  next();
});

// Check if all offices have approved
certificateSchema.methods.checkFullApproval = function() {
  this.isFullyApproved = this.officeApprovals.every(
    approval => approval.status === 'Approved'
  );
  
  if (this.isFullyApproved) {
    this.status = 'Issued';
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days validity
  }
  
  return this.isFullyApproved;
};

export default model('Certificate', certificateSchema);