import React from "react";
export const attendanceColumns = [
  {
    header: "Sl No",
    accessor: "slNo",
  },
  {
    header: "Employee Name",
    accessor: "name",
  },
  {
    header: "Employee ID",
    accessor: "employeeId",
  },
  {
    header: "Check In",
    accessor: "firstSwipeIn",
  },
  {
    header: "Check Out",
    accessor: "lastSwipeOut",
  },
  {
    header: "Working Hours",
    accessor: "totalHours",
  },
  {
    header: "Status",
    accessor: "attendanceToday",
    sortable: false,
    render: (row) => (
      <span
        style={{
          color: row.attendanceToday ? "green" : "red",
          fontWeight: 500,
          fontSize: "13px",
        }}
      >
        {row.attendanceToday ? "Present" : "Absent"}
      </span>
    ),
  },
];
