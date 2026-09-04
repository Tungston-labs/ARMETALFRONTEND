import * as XLSX from "xlsx-js-style";

export const exportAttendanceExcel = (attendanceData = []) => {
  const workbook = XLSX.utils.book_new();

  const rows = [
    ["ATTENDANCE REPORT"],
    [],
    [`Total Employees: ${attendanceData.length}`],
    [],
    [
      "Sl No",
      "Employee ID",
      "Employee Name",
      "Department",
      "Working Days",
      "Present Days",
      "Absent Days",
      "LOP Days",
    ],
  ];

  attendanceData.forEach((emp, index) => {
    rows.push([
      index + 1,
      emp.employee_id,
      emp.employee_name,
      emp.department,
      emp.working_days,
      emp.present_days,
      emp.absent_days,
      emp.lop_days,
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws["!cols"] = [
    { wch: 8 },
    { wch: 20 },
    { wch: 30 },
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    ws,
    "Attendance Report"
  );

  XLSX.writeFile(
    workbook,
    "Attendance_Report.xlsx"
  );
};