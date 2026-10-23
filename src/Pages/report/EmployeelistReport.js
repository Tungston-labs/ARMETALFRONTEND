import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportEmployeePDF = (employees = []) => {
  const doc = new jsPDF("landscape");

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("EMPLOYEE MASTER REPORT", 14, 15);

  // Total Employees
  doc.setFontSize(11);
  doc.text(`Total Employees: ${employees.length}`, 14, 25);

  // Table Data
  const tableData = employees.map((employee, index) => [
    index + 1,
    employee?.employee_id || "-",
    employee?.name || "-",
    employee?.department || "-",
    employee?.designation || "-",
    employee?.employment_type || "-",
    employee?.phno || "-",
    employee?.email || "-",
    employee?.joining_date || "-",
  ]);

  autoTable(doc, {
    startY: 35,
    head: [[
      "Sl No",
      "Employee ID",
      "Employee Name",
      "Department",
      "Designation",
      "Employment Type",
      "Phone Number",
      "Email",
      "Joining Date",
    ]],
    body: tableData,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [48, 78, 176],
      textColor: 255,
      fontStyle: "bold",
    },
  });

  doc.save("Employee_Master_Report.pdf");
};