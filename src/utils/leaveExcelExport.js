import * as XLSX from "xlsx-js-style";

export const exportLeaveReport = (
  filteredLeaves,
  page,
  formatDate
) => {
  const total = filteredLeaves.length;

  const approved = filteredLeaves.filter(
    (x) => x.status === "approved"
  ).length;

  const pending = filteredLeaves.filter(
    (x) => x.status === "pending"
  ).length;

  const rejected = filteredLeaves.filter(
    (x) => x.status === "rejected"
  ).length;

  const workbook = XLSX.utils.book_new();

  const rows = [
    ["MONTHLY LEAVE REPORT"],
    [" HR Management System"],
    [],
    [`Generated Date: ${new Date().toLocaleDateString()}`],
    [
      `Total Requests: ${total} | Approved: ${approved} | Pending: ${pending} | Rejected: ${rejected}`,
    ],
    [],
    [
      "Sl No",
      "Employee Name",
      "Employee ID",
      "Department",
      "Leave Type",
      "Start Date",
      "End Date",
      "Applied Date",
      "Status",
      "Reason",
    ],
  ];

  filteredLeaves.forEach((leave, index) => {
    rows.push([
      index + 1 ,
      leave?.employee?.name || "N/A",
      leave?.employee?.employee_id ||
        leave?.employee?.id ||
        "N/A",
      leave?.employee?.department || "N/A",
      leave?.leave_type || "N/A",
      formatDate(leave?.from_date),
      formatDate(leave?.to_date),
      formatDate(leave?.created_at),
      (leave?.status || "pending").toUpperCase(),
      leave?.reason || "-",
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Merge Title & Subtitle
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 9 } },
  ];

  // Column Widths
  ws["!cols"] = [
    { wch: 10 }, // Sl No
    { wch: 30 }, // Employee Name
    { wch: 30 }, // Employee ID
    { wch: 40 }, // Department
    { wch: 20 }, // Leave Type
    { wch: 18 }, // Start Date
    { wch: 18 }, // End Date
    { wch: 20 }, // Applied Date
    { wch: 15 }, // Status
    { wch: 50 }, // Reason
  ];

  // Row Heights
  ws["!rows"] = [];

  for (let i = 0; i < rows.length; i++) {
    ws["!rows"][i] = {
      hpt:
        i === 0
          ? 35
          : i === 1
          ? 24
          : i < 7
          ? 22
          : 25,
    };
  }

  // Main Title
  ws["A1"].s = {
    font: {
      bold: true,
      sz: 22,
      color: { rgb: "FFFFFF" },
    },
    fill: {
      fgColor: { rgb: "0F172A" },
    },
    alignment: {
      horizontal: "center",
      vertical: "center",
    },
  };

  // Subtitle
  ws["A2"].s = {
    font: {
      bold: true,
      sz: 12,
      color: { rgb: "FFFFFF" },
    },
    fill: {
      fgColor: { rgb: "334155" },
    },
    alignment: {
      horizontal: "center",
      vertical: "center",
    },
  };

  // Summary Rows
  ["A4", "A5"].forEach((cell) => {
    if (ws[cell]) {
      ws[cell].s = {
        font: {
          bold: true,
          sz: 11,
        },
        fill: {
          fgColor: {
            rgb: "E2E8F0",
          },
        },
        border: {
          top: {
            style: "thin",
            color: { rgb: "CBD5E1" },
          },
          bottom: {
            style: "thin",
            color: { rgb: "CBD5E1" },
          },
        },
      };
    }
  });

  // Header Row
  const headers = [
    "A7",
    "B7",
    "C7",
    "D7",
    "E7",
    "F7",
    "G7",
    "H7",
    "I7",
    "J7",
  ];

  headers.forEach((cell) => {
    ws[cell].s = {
      font: {
        bold: true,
        color: { rgb: "FFFFFF" },
        sz: 11,
      },
      fill: {
        fgColor: { rgb: "1E293B" },
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
        wrapText: true,
      },
      border: {
        top: {
          style: "thin",
          color: { rgb: "D1D5DB" },
        },
        bottom: {
          style: "thin",
          color: { rgb: "D1D5DB" },
        },
        left: {
          style: "thin",
          color: { rgb: "D1D5DB" },
        },
        right: {
          style: "thin",
          color: { rgb: "D1D5DB" },
        },
      },
    };
  });

  // Data Rows Styling
  for (let i = 8; i <= rows.length; i++) {
    const even = i % 2 === 0;

    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].forEach(
      (col) => {
        const cell = `${col}${i}`;

        if (ws[cell]) {
          ws[cell].s = {
            alignment: {
              horizontal:
                col === "B" ||
                col === "D" ||
                col === "J"
                  ? "left"
                  : "center",
              vertical: "center",
              wrapText: true,
            },
            fill: even
              ? {
                  fgColor: {
                    rgb: "F8FAFC",
                  },
                }
              : {
                  fgColor: {
                    rgb: "FFFFFF",
                  },
                },
            border: {
              top: {
                style: "thin",
                color: { rgb: "E5E7EB" },
              },
              bottom: {
                style: "thin",
                color: { rgb: "E5E7EB" },
              },
              left: {
                style: "thin",
                color: { rgb: "E5E7EB" },
              },
              right: {
                style: "thin",
                color: { rgb: "E5E7EB" },
              },
            },
          };
        }
      }
    );

    const statusCell = `I${i}`;

    if (ws[statusCell]) {
      const status =
        ws[statusCell].v?.toLowerCase();

      if (status === "approved") {
        ws[statusCell].s.fill = {
          fgColor: {
            rgb: "BBF7D0",
          },
        };
      }

      if (status === "pending") {
        ws[statusCell].s.fill = {
          fgColor: {
            rgb: "FDE68A",
          },
        };
      }

      if (status === "rejected") {
        ws[statusCell].s.fill = {
          fgColor: {
            rgb: "FCA5A5",
          },
        };
      }

      ws[statusCell].s.font = {
        bold: true,
      };
    }
  }

  // Freeze Header
  ws["!freeze"] = {
    ySplit: 7,
  };

  // Auto Filter
  ws["!autofilter"] = {
    ref: "A7:J1000",
  };

  XLSX.utils.book_append_sheet(
    workbook,
    ws,
    "Leave Report"
  );

  XLSX.writeFile(
    workbook,
    `Rekory_Leave_Report_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`
  );
};