// import XLSX from "xlsx-js-style";

// export const exportAttendanceExcel = (employees, selectedMonth) => {
//   const workbook = XLSX.utils.book_new();
//   const ws = {};

//   let row = 0;
//   const merges = [];

//   const titleStyle = {
//     font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
//     fill: { fgColor: { rgb: "1F4E78" } },
//     alignment: { horizontal: "center", vertical: "center" },
//   };

//   const sectionStyle = {
//     font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
//     fill: { fgColor: { rgb: "5B9BD5" } },
//     alignment: { horizontal: "left", vertical: "center" },
//   };

//   const labelStyle = {
//     font: { bold: true },
//     fill: { fgColor: { rgb: "EAF2F8" } },
//     border: {
//       top: { style: "thin" },
//       bottom: { style: "thin" },
//       left: { style: "thin" },
//       right: { style: "thin" },
//     },
//   };

//   const valueStyle = {
//     border: {
//       top: { style: "thin" },
//       bottom: { style: "thin" },
//       left: { style: "thin" },
//       right: { style: "thin" },
//     },
//   };

//   const headerStyle = {
//     font: { bold: true, color: { rgb: "FFFFFF" } },
//     fill: { fgColor: { rgb: "4472C4" } },
//     alignment: { horizontal: "center", vertical: "center" },
//     border: {
//       top: { style: "thin" },
//       bottom: { style: "thin" },
//       left: { style: "thin" },
//       right: { style: "thin" },
//     },
//   };

//   const dataStyle = {
//     alignment: { horizontal: "center", vertical: "center" },
//     border: {
//       top: { style: "thin" },
//       bottom: { style: "thin" },
//       left: { style: "thin" },
//       right: { style: "thin" },
//     },
//   };

//   const addCell = (r, c, value, style = {}) => {
//     const ref = XLSX.utils.encode_cell({ r, c });

//     ws[ref] = {
//       t: typeof value === "number" ? "n" : "s",
//       v: value,
//       s: style,
//     };
//   };

//   employees.forEach((emp) => {
//     // Title
//     addCell(
//       row,
//       0,
//       `MONTHLY ATTENDANCE REPORT - ${selectedMonth}`,
//       titleStyle
//     );

//     merges.push({
//       s: { r: row, c: 0 },
//       e: { r: row, c: 4 },
//     });

//     row += 2;

//     // Employee Details Heading
//     addCell(row, 0, "Employee Details", sectionStyle);
//     merges.push({
//       s: { r: row, c: 0 },
//       e: { r: row, c: 1 },
//     });

//     row++;

//     const details = [
//       ["Employee Name", emp.employee_name],
//       ["User Name", emp.employee_id],
//       ["Department", emp.department],
//       ["Working Days", emp.working_days],
//       ["Present Days", emp.present_days],
//       ["Absent Days", emp.absent_days],
//       ["LOP Days", emp.lop_days],
//     ];

//     details.forEach(([label, value]) => {
//       addCell(row, 0, label, labelStyle);
//       addCell(row, 1, value ?? "-", valueStyle);
//       row++;
//     });

//     row++;

//     // Daily Attendance Heading
//     addCell(row, 0, "Daily Attendance", sectionStyle);
//     merges.push({
//       s: { r: row, c: 0 },
//       e: { r: row, c: 4 },
//     });

//     row++;

//     // Header
//     ["Date", "Status", "Punch In", "Punch Out", "Total Hours"].forEach(
//       (text, col) => addCell(row, col, text, headerStyle)
//     );

//     row++;

//     // Attendance Data
//     emp.daily_records.forEach((record) => {
//       addCell(row, 0, record.date || "-", dataStyle);
//       addCell(row, 1, record.status || "-", dataStyle);
//       addCell(row, 2, record.first_punch_in || "-", dataStyle);
//       addCell(row, 3, record.last_punch_out || "-", dataStyle);
//       addCell(row, 4, record.total_hours || "-", dataStyle);

//       row++;
//     });

//     row += 2;
//   });

//   ws["!ref"] = XLSX.utils.encode_range({
//     s: { r: 0, c: 0 },
//     e: { r: row, c: 4 },
//   });

//   ws["!cols"] = [
//     { wch: 18 },
//     { wch: 25 },
//     { wch: 18 },
//     { wch: 18 },
//     { wch: 18 },
//   ];

//   ws["!rows"] = Array.from({ length: row + 1 }, () => ({
//     hpt: 22,
//   }));

//   ws["!merges"] = merges;

//   XLSX.utils.book_append_sheet(workbook, ws, "Attendance");

//   XLSX.writeFile(
//     workbook,
//     `Attendance_${selectedMonth.replace(/\s+/g, "_")}.xlsx`
//   );
// };