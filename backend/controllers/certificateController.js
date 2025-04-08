import Certificate from "../db/models/certificateModel.js";
import TryCatch from "../utils/TryCatch.js";
import { Student } from "../db/models/studentModel.js";
import Due from "../db/models/dueModel.js";
import { Officer } from "../db/models/officeModel.js";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";


export const createCertificate = TryCatch(async (req, res) => {
  const { studentId, purpose } = req.body;

  const student = await Student.findById(studentId);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  // Check if student has any pending dues
  const pendingDues = await Due.find({
    studentId,
    status: { $ne: "PAID" },
  });

  if (pendingDues.length > 0) {
    return res.status(400).json({
      message: "Cannot request No Due Certificate. You have pending dues.",
      pendingDues: pendingDues.map((due) => ({
        description: due.description,
        amount: due.amount,
      })),
    });
  }

  // Define all departments that need to approve
  const requiredDepartments = [
    "Office",
    "Library",
    "College Bus",
    "Class Tutor",
  ];

  // Find officers for each department
  const officeApprovals = [];

  for (const department of requiredDepartments) {
    const officer = await Officer.findOne({ department: department });

    if (officer) {
      officeApprovals.push({
        officeStaffId: officer._id,
        department: department,
        status: "PENDING",
        remarks: "",
      });
    } else {
      console.warn(`No officer found for department: ${department}`);
    }
  }

 

  // Ensure at least one approval exists
  if (officeApprovals.length === 0) {
    return res.status(400).json({
      message:
        "No officers found to approve the certificate. Please contact system admin.",
    });
  }
  const requestDate = new Date().toISOString().split("T")[0];

  const certificate = await Certificate.create({
    studentId,
    officeApprovals,
    type: "NO_DUE",
    purpose,
    status: "PENDING",
    requestDate,
    totalRequiredApprovals: officeApprovals.length,
  });

  res.status(201).json({
    message: "No Due Certificate request submitted successfully",
    certificate: {
      _id: certificate._id,
      departments: officeApprovals.map((approval) => approval.department),
    },
  });
});

export const fetchAllMyCertificates = TryCatch(async (req, res) => {
  const { studentId } = req.params;
  const certificates = await Certificate.find({ studentId: studentId });
  res.status(200).json({ certificates });
});

export const fetchAllCertRequests = TryCatch(async (req, res) => {
  const { officerId } = req.params;


  try {
    // First, verify the officer exists and log their details
    const officer = await Officer.findById(officerId);
    if (!officer) {
      return res.status(404).json({ message: "Officer not found" });
    }

   

    // Find all certificates and log for debugging
    const allCertificates = await Certificate.find({}).populate({
      path: "studentId",
      select: "firstName lastName department",
    });


    // Filter certificates where the officer's department is in office approvals
    const certificates = allCertificates.filter((cert) =>
      cert.officeApprovals.some(
        (approval) => approval.department === officer.department
      )
    );

   

    res.status(200).json({
      certificates: allCertificates,
      message: "Certificate requests fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return res.status(500).json({
      message: "Failed to fetch certificate requests",
      error: error.message,
    });
  }
});

export const deleteCertificateRequest = TryCatch(async (req, res) => {
  const { certificateId } = req.params;

  const certificate = await Certificate.findById(certificateId);

  if (!certificate) {
    return res.status(404).json({ message: "Certificate request not found" });
  }

  // Only allow deleting pending requests
  if (certificate.status !== "PENDING") {
    return res.status(400).json({
      message: "Only pending certificate requests can be deleted",
    });
  }

  await Certificate.findByIdAndDelete(certificateId);

  res.status(200).json({
    message: "Certificate request deleted successfully",
  });
});

export const updateCertificateStatus = TryCatch(async (req, res) => {
  const { certificateId } = req.params;
  const { status, remarks } = req.body;

  // Find the certificate
  const certificate = await Certificate.findById(certificateId);
  if (!certificate) {
    return res.status(404).json({ message: "Certificate not found" });
  }

  // Find the officer making the request
  const officer = await Officer.findById(req.user._id);
  if (!officer) {
    return res.status(403).json({ message: "Unauthorized officer" });
  }

  // Find and update the specific department's approval
  const departmentApprovalIndex = certificate.officeApprovals.findIndex(
    (approval) => approval.department === officer.department
  );

  if (departmentApprovalIndex === -1) {
    return res.status(403).json({
      message: `No approval found for ${officer.department} department`,
    });
  }

  // Update the specific department's approval
  certificate.officeApprovals[departmentApprovalIndex].status = status;
  certificate.officeApprovals[departmentApprovalIndex].remarks = remarks || "";
  certificate.officeApprovals[departmentApprovalIndex].approvedAt = new Date();

  // Check approval status
  const allApprovals = certificate.officeApprovals;
  const approvedCount = allApprovals.filter(
    (approval) => approval.status === "Approved"
  ).length;

  const rejectedCount = allApprovals.filter(
    (approval) => approval.status === "Rejected"
  ).length;

  // Determine overall certificate status
  if (rejectedCount > 0) {
    // If any department rejects, the entire certificate is rejected
    certificate.status = "Rejected";
  } else if (approvedCount === allApprovals.length) {
    // All departments have approved
    certificate.status = "Approved";
  } else {
    // Some departments are still pending
    certificate.status = "PROCESSING";
  }

  // Save the updated certificate
  await certificate.save();

 

  res.status(200).json({
    message: `Certificate status updated for ${officer.department}`,
    certificate: {
      _id: certificate._id,
      status: certificate.status,
      officeApprovals: certificate.officeApprovals,
    },
  });
});

export const generateCertificatePDF = TryCatch(async (req, res) => {
  const { certificateId } = req.params;
 

  // Find the certificate with populated office staff details
  const populatedCertificate = await Certificate.findById(certificateId)
    .populate({
      path: "officeApprovals.officeStaffId",
      select: "firstName lastName department",
    })
    .populate(
      "studentId",
      "firstName lastName department semester admissionNo"
    );

  if (!populatedCertificate) {
    console.error("Certificate not found");
    return res.status(404).json({ message: "Certificate not found" });
  }


  // Check if certificate is approved
  if (populatedCertificate.status !== "Approved") {
    console.error("Certificate not approved");
    return res.status(400).json({
      message: "Certificate must be approved to generate PDF",
      currentStatus: populatedCertificate.status,
    });
  }

  const student = populatedCertificate.studentId;

  // Create a new PDF document
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
const { width, height } = page.getSize();

// Embed fonts
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

// Modern color palette using pdf-lib's rgb function
const colors = {
  primary: rgb(0.047, 0.169, 0.341),     // Dark blue
  secondary: rgb(0.114, 0.533, 0.686),     // Medium blue
  success: rgb(0.165, 0.631, 0.373),       // Green
  danger: rgb(0.761, 0.169, 0.231),        // Red
  text: rgb(0.2, 0.2, 0.2),
  muted: rgb(0.4, 0.4, 0.4),
  white: rgb(1, 1, 1),
};

// Spacing system for consistent margins and line heights
const spacing = {
  xl: 50,
  lg: 30,
  md: 25,
  sm: 20,
  xs: 15,
};

// Start tracking vertical position from near the top
let currentY = height - 40;

// ----- Modern Header with Background -----
// Draw header background (with no custom opacity function – use the opacity option)
page.drawRectangle({
  x: 0,
  y: currentY - 100,
  width: width,
  height: 140,
  color: colors.primary,
});

// Institution name (left-aligned)
page.drawText("COLLEGE OF ENGINEERING TRIKARIPUR", {
  x: 50,
  y: currentY - 40,
  size: 20,
  font: boldFont,
  color: colors.white,
});

// Certificate title
page.drawText("NO DUES CERTIFICATE", {
  x: 50,
  y: currentY - 80,
  size: 28,
  font: boldFont,
  color: colors.white,
});

// Certificate number badge
const certificateNumber = certificateId.slice(-6).toUpperCase();
const certNumText = `Certificate ID: ${certificateNumber}`;
const certNumWidth = boldFont.widthOfTextAtSize(certNumText, 12);
page.drawRectangle({
  x: width - certNumWidth - 60,
  y: currentY - 95,
  width: certNumWidth + 40,
  height: 35,
  color: colors.success,
  borderRadius: 17,
});
page.drawText(certNumText, {
  x: width - certNumWidth - 40,
  y: currentY - 90,
  size: 12,
  font: boldFont,
  color: colors.white,
});

// Update vertical position after header
currentY -= 160;

// ----- Student Information Section -----
// Section title
page.drawText("Student Details", {
  x: 50,
  y: currentY,
  size: 16,
  font: boldFont,
  color: colors.primary,
});
currentY -= spacing.lg;

// Define grid columns for details
const detailColumns = {
  left: { x: 50 },
  right: { x: 350, width: 200 },
};

// Left column details array
const leftDetails = [
  { label: "Name:", value: `${student.firstName} ${student.lastName}` },
  { label: "Admission No:", value: student.admissionNo },
  { label: "Department:", value: student.department },
  { label: "Semester:", value: `Semester ${student.semester}` },
  { label: "Issue Date:", value: new Date().toLocaleDateString("en-IN") },
];

// Draw left details with consistent spacing
leftDetails.forEach((detail, index) => {
  const yPos = currentY - index * spacing.md;
  page.drawText(detail.label, {
    x: detailColumns.left.x,
    y: yPos,
    size: 12,
    font: boldFont,
    color: colors.muted,
  });
  page.drawText(detail.value, {
    x: detailColumns.left.x + 100,
    y: yPos,
    size: 12,
    font: font,
    color: colors.text,
  });
});

// Right column: Purpose
page.drawText("Purpose:", {
  x: detailColumns.right.x,
  y: currentY,
  size: 12,
  font: boldFont,
  color: colors.muted,
});
page.drawText(populatedCertificate.purpose, {
  x: detailColumns.right.x,
  y: currentY - spacing.sm,
  size: 12,
  font: font,
  color: colors.text,
  maxWidth: detailColumns.right.width,
  lineHeight: spacing.sm,
});

// Adjust currentY after left column details
currentY -= leftDetails.length * spacing.md + spacing.lg;

// ----- Certification Text -----
const certText = `This is to certify that ${student.firstName} ${student.lastName}, bearing Admission No ${student.admissionNo}, has successfully cleared all outstanding dues and obligations to the institution. All necessary departmental clearances have been obtained as verified below.`;
page.drawText(certText, {
  x: 50,
  y: currentY+8,
  size: 14,
  font: font,
  color: colors.text,
  maxWidth: width - 100,
  lineHeight: spacing.sm,
});
currentY -= spacing.xl;

// ----- Approval Matrix -----
// Define table columns (including a serial number column)
const tableColumns = [
  { title: "Sr. No.", width: 50 },
  { title: "Department", width: 170 },
  { title: "Officer Name", width: 170 },
  { title: "Status", width: 80 },
  { title: "Date", width: 100 },
];

// Table section title
page.drawText("Clearance Verification", {
  x: 50,
  y: currentY-20,
  size: 16,
  font: boldFont,
  color: colors.primary,
});
currentY -= spacing.md;

// Table header background and border
const tableWidth = tableColumns.reduce((sum, col) => sum + col.width, 0);
const headerY = currentY - spacing.sm;
page.drawRectangle({
  x: 15,
  y: headerY-20,
  width: tableWidth,
  height: spacing.lg,
  color: colors.primary,
  opacity: 0.1,
  borderColor: colors.primary,
  borderWidth: 1,
});

// Table header texts and vertical separators
let xPos = 30;
tableColumns.forEach((col) => {
  page.drawText(col.title, {
    x: xPos + 22,
    y: headerY - 15,
    size: 14,
    font: boldFont,
    color: colors.primary,
  });
  // Draw vertical line at column boundary
  page.drawLine({
    start: { x: xPos + col.width+19, y: headerY+12 },
    end: { x: xPos + col.width+19, y: headerY - spacing.lg + 10 },
    thickness: 1,
    color: colors.primary,
  });
  xPos += col.width;
});
currentY = headerY - spacing.lg - spacing.sm;

// Table rows
populatedCertificate.officeApprovals.forEach((approval, rowIndex) => {
  xPos = 50;
  const rowY = currentY - rowIndex * spacing.lg;
  // Row background with light border
  page.drawRectangle({
    x: 15,
    y: rowY,
    width: tableWidth,
    height: spacing.lg,
    borderColor: colors.muted,
    borderWidth: 0.5,
  });

  // Serial Number (Centered in its column)
  page.drawText(`${rowIndex + 1}.`, {
    x: 50 + (tableColumns[0].width / 2) - 5,
    y: rowY + 8,
    size: 12,
    font: boldFont,
    color: colors.text,
  });
  xPos += tableColumns[0].width;

  // Department
  page.drawText(approval.department, {
    x: xPos + 5,
    y: rowY + 8,
    size: 12,
    font: font,
    color: colors.text,
  });
  xPos += tableColumns[1].width;

  // Officer Name
  const staffName = approval.officeStaffId
    ? `${approval.officeStaffId.firstName} ${approval.officeStaffId.lastName}`
    : "Pending";
  page.drawText(staffName, {
    x: xPos + 5,
    y: rowY + 8,
    size: 12,
    font: font,
    color: colors.text,
  });
  xPos += tableColumns[2].width;

  // Status (centered)
  const statusColor = approval.status === "Approved" ? colors.success : colors.danger;
  page.drawText(approval.status, {
    x: xPos - (tableColumns[3].width / 2) + 45,
    y: rowY + 8,
    size: 12,
    font: boldFont,
    color: statusColor,
  });
  xPos += tableColumns[3].width;

  // Date
  const dateText = approval.approvedAt
    ? new Date(approval.approvedAt).toLocaleDateString("en-IN")
    : "--/--/----";
  page.drawText(dateText, {
    x: xPos + 5,
    y: rowY + 8,
    size: 12,
    font: font,
    color: colors.muted,
  });
});

// Draw vertical separators across the table (if needed)
tableColumns.slice(0, -1).forEach((col, idx) => {
  const sepX = 50 + tableColumns.slice(0, idx + 1).reduce((sum, c) => sum + c.width, 0);
  page.drawLine({
    start: { x: sepX, y: currentY - populatedCertificate.officeApprovals.length * spacing.md + spacing.xl*3 },
    end: { x: sepX, y: currentY - spacing.lg*3 },
    thickness: 0.5,
    color: colors.muted,
    opacity: 0.3,
  });
});
currentY -= populatedCertificate.officeApprovals.length * spacing.lg + spacing.xl;

// ----- Digital Verification Stamp -----
const stampText = "DIGITALLY VERIFIED";
const stampSize = 14;
const stampWidth = boldFont.widthOfTextAtSize(stampText, stampSize);
const stampX = width - stampWidth - 80;
const stampY = Math.max(currentY, 150); // Ensure minimum margin

// Stamp background (with border radius and opacity applied via draw options)
page.drawRectangle({
  x: stampX - 20,
  y: stampY - 20,
  width: stampWidth + 40,
  height: 50,
  color: colors.success,
  borderRadius: 8,
});

// Draw a simple checkmark (centered in the stamp)
const checkStartX = stampX + (stampWidth / 2) - 10;
page.drawLine({
  start: { x: checkStartX, y: stampY + 20 },
  end: { x: checkStartX + 8, y: stampY + 12 },
  thickness: 2,
  color: colors.white,
});
page.drawLine({
  start: { x: checkStartX + 8, y: stampY + 12 },
  end: { x: checkStartX + 16, y: stampY + 24 },
  thickness: 2,
  color: colors.white,
});

// Stamp text (centered)
page.drawText(stampText, {
  x: stampX-5,
  y: stampY - 10,
  size: stampSize,
  font: boldFont,
  color: colors.white,
});

// Signature text below stamp (supports multi-line via newline)
page.drawText("Authorized \nCollege of Engineering Trikaripur", {
  x: stampX - 20,
  y: stampY - 55,
  size: 12,
  font: font,
  color: colors.muted,
  lineHeight: 12,
});

// ----- Footer -----
page.drawText(
  "This certificate is digitally generated and requires no physical signature",
  {
    x: 50,
    y: stampY - 100, // Adjusted for better spacing
    size: 12,
    font: font,
    color: colors.muted,
    opacity: 0.7,
  }
);

// Serialize PDF to bytes and send as response
const pdfBytes = await pdfDoc.save();
res.contentType("application/pdf");
res.setHeader(
  "Content-Disposition",
  `attachment; filename=no_dues_certificate_${student.admissionNo}.pdf`
);

  res.send(Buffer.from(pdfBytes));
});
