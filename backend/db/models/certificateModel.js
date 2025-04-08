import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    officeApprovals: [
      {
        officeStaffId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Officer",
          required: true,
        },
        department: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["PENDING", "Approved", "Rejected"],
          default: "PENDING",
        },
        remarks: {
          type: String,
          default: "",
        },
        approvedAt: {
          type: Date,
        },
      },
    ],
    type: {
      type: String,
      enum: ["NO_DUE"],
      default: "NO_DUE",
    },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "Approved", "Rejected"],
      default: "PENDING",
    },
    purpose: {
      type: String,
      trim: true,
    },
    totalRequiredApprovals: {
      type: Number,
      required: true,
    },
    certificateNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual to check if all approvals are complete
certificateSchema.virtual("isFullyApproved").get(function () {
  return (
    this.officeApprovals.every((approval) => approval.status === "APPROVED") &&
    this.officeApprovals.length === this.totalRequiredApprovals
  );
});

export default mongoose.model("Certificate", certificateSchema);
