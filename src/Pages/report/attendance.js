import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportAttendancePDF = (attendanceData = []) => {
  const doc = new jsPDF("landscape");

  doc.setFontSize(18);
  doc.text("Attendance Report", 14, 20);

  doc.setFontSize(11);
  doc.text(
    `Total Employees: ${attendanceData.length}`,
    14,
    30
  );

  const tableData = attendanceData.map((emp, index) => [
    index + 1,
    emp.employee_id,
    emp.employee_name,
    emp.department,
    emp.working_days,
    emp.present_days,
    emp.absent_days,
    emp.lop_days,
  ]);

  autoTable(doc, {
    startY: 40,
    head: [[
      "Sl No",
      "Employee ID",
      "Employee Name",
      "Department",
      "Working Days",
      "Present Days",
      "Absent Days",
      "LOP Days",
    ]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [30, 58, 138],
    },
  });

  doc.save("Attendance_Report.pdf");
};