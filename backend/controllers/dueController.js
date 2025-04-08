import Due from "../db/models/dueModel.js";
import { Officer } from "../db/models/officeModel.js";
import { Student } from "../db/models/studentModel.js";
import TryCatch from "../utils/TryCatch.js";

export const createDue = TryCatch(async (req, res) => {

  const { admissionNo, department, amount, description } = req.body;

  const student = await Student.findOne({ admissionNo });

  if (!student) {
    return res.status(404).json({
      message: "Student not found",
    });
  }

  const due = await Due.create({
    studentId: student._id,
    studentName: `${student.firstName} ${student.lastName}`,
    officeStaffId: req.user._id,
    department,
    amount,
    description,
    status: "Pending",
  });
  res.status(201).json({
    due,
    message: "Due created successfully",
  });
});

export const fetchAllDues = TryCatch(async (req, res) => {
  const dues = await Due.find({ officeStaffId: req.user._id });
  res.status(200).json({
    dues,
    message: "Dues fetched successfully",
  });
});

export const fetchStudentDues = TryCatch(async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findById(studentId);
  if (!student) {
    return res.status(404).json({
      message: "Student not found",
    });
  }

  // Find dues for the student
  const dues = await Due.find({ studentId: student._id });

  // Fetch office staff details for each due
  const duesWithOfficeStaff = await Promise.all(
    dues.map(async (due) => {
      const officeStaff = await Officer.findById(due.officeStaffId);

      // Create a new object with the due details and office staff department
      return {
        ...due.toObject(), // Convert Mongoose document to plain object
        officeStaff: officeStaff ? officeStaff.department : "Unknown",
      };
    })
  );

  res.status(200).json({
    dues: duesWithOfficeStaff,
    message: "Dues fetched successfully",
  });
});

export const setDueStatus = TryCatch(async (req, res) => {
  const { status } = req.body;
  const { dueId } = req.params;

  // Find the due and ensure the requesting user is the owner
  const due = await Due.findOneAndUpdate(
    {
      _id: dueId,
      officeStaffId: req.user._id,
    },
    {
      status: status,
      paidAt: status === "Paid" ? new Date() : null,
    },
    { new: true }
  );
  if (!due) {
    return res.status(404).json({
      message: "Due not found",
    });
  }

  due.status = status;
  await due.save();
  res.status(200).json({
    due,
    message: "Due status updated successfully",
  });
});

export const deleteDue = TryCatch(async (req, res) => {
  const { dueId } = req.params;

  // Find the due and ensure it's paid and belongs to the user
  const due = await Due.findOneAndDelete({
    _id: dueId,
    officeStaffId: req.user._id,
    status: "Paid",
  });

  if (!due) {
    return res.status(404).json({
      message: "Paid due not found or unauthorized to delete",
    });
  }

  res.status(200).json({
    message: "Paid due deleted successfully",
    dueId: due._id,
  });
});

export const requestCashPayment = TryCatch(async (req, res) => {
  const { dueId } = req.params;
  const due = await Due.findById(dueId);
  if (!due) {
    return res.status(404).json({
      message: "Due not found",
    });
  }

  // Find the office staff who created the due
  const officeStaff = await Officer.findById(due.officeStaffId);
  if (!officeStaff) {
    return res.status(404).json({
      message: "Office staff not found",
    });
  }

  res.status(200).json({
    message: `Please pay ₹${due.amount} in cash to ${officeStaff.firstName} ${officeStaff.lastName} from the ${officeStaff.department} office.`,
    officeStaff: {
      name: `${officeStaff.firstName} ${officeStaff.lastName}`,
      department: officeStaff.department,
    },
  });
});
