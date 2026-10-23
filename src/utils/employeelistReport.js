import * as XLSX from "xlsx-js-style";

export const exportEmployeeReport = (employees = []) => {
  const workbook = XLSX.utils.book_new();

  const rows = [
    ["EMPLOYEE MASTER REPORT"],
    [],
    [`Total Employees: ${employees.length}`],
    [],
    [
      "Sl No",
      "Employee ID",
      "Employee Name",
      "Department",
      "Designation",
      "Employment Type",
      "Phone Number",
      "Email",
      "Joining Date",
    ],
  ];

  employees.forEach((employee, index) => {
    rows.push([
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
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Merge Title
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
  ];

  // Column Widths
  ws["!cols"] = [
    { wch: 8 },   // Sl No
    { wch: 18 },  // Employee ID
    { wch: 30 },  // Employee Name
    { wch: 25 },  // Department
    { wch: 25 },  // Designation
    { wch: 18 },  // Employment Type
    { wch: 18 },  // Phone
    { wch: 35 },  // Email
    { wch: 18 },  // Joining Date
  ];

  // Row Heights
  ws["!rows"] = [];
  ws["!rows"][0] = { hpt: 30 };

  // Title
  ws["A1"].s = {
    font: {
      bold: true,
      sz: 18,
      color: { rgb: "FFFFFF" },
    },
    fill: {
      fgColor: { rgb: "1E3A8A" },
    },
    alignment: {
      horizontal: "center",
      vertical: "center",
    },
  };

  // Total Employees
  if (ws["A3"]) {
    ws["A3"].s = {
      font: {
        bold: true,
        sz: 12,
      },
      fill: {
        fgColor: { rgb: "E5E7EB" },
      },
    };
  }

  // Header Row
  const headers = [
    "A5",
    "B5",
    "C5",
    "D5",
    "E5",
    "F5",
    "G5",
    "H5",
    "I5",
  ];

  headers.forEach((cell) => {
    ws[cell].s = {
      font: {
        bold: true,
        color: { rgb: "FFFFFF" },
      },
      fill: {
        fgColor: { rgb: "111827" },
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
      border: {
        top: { style: "thin", color: { rgb: "D1D5DB" } },
        bottom: { style: "thin", color: { rgb: "D1D5DB" } },
        left: { style: "thin", color: { rgb: "D1D5DB" } },
        right: { style: "thin", color: { rgb: "D1D5DB" } },
      },
    };
  });

  // Data Rows
  for (let i = 6; i <= rows.length; i++) {
    const even = i % 2 === 0;

    ["A", "B", "C", "D", "E", "F", "G", "H", "I"].forEach((col) => {
      const cell = `${col}${i}`;

      if (ws[cell]) {
        ws[cell].s = {
          alignment: {
            horizontal:
              col === "C" ||
              col === "D" ||
              col === "E" ||
              col === "H"
                ? "left"
                : "center",
            vertical: "center",
            wrapText: true,
          },
          fill: even
            ? { fgColor: { rgb: "F9FAFB" } }
            : { fgColor: { rgb: "FFFFFF" } },
          border: {
            top: { style: "thin", color: { rgb: "E5E7EB" } },
            bottom: { style: "thin", color: { rgb: "E5E7EB" } },
            left: { style: "thin", color: { rgb: "E5E7EB" } },
            right: { style: "thin", color: { rgb: "E5E7EB" } },
          },
        };
      }
    });
  }

  // Freeze Header
  ws["!freeze"] = {
    ySplit: 5,
  };

  // Auto Filter
  ws["!autofilter"] = {
    ref: "A5:I1000",
  };

  XLSX.utils.book_append_sheet(
    workbook,
    ws,
    "Employee Report"
  );

  XLSX.writeFile(
    workbook,
    "Employee_Master_Report.xlsx"
  );
};