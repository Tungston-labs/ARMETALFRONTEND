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


// export const attendanceDummyData = [
//   {
//     id: 18,
//     name: "test emp",
//     employeeId: "test12@gmail.com",
//     date: "2026-08-29",
//     firstSwipeIn: "03:20 PM",
//     lastSwipeOut: "03:25 PM",
//     totalHours: "00:05",
//     attendanceToday: true,
//   },
//   {
//     id: 2,
//     name: "DUMMY002",
//     employeeId: "abc2002@yopmail.com",
//     date: null,
//     firstSwipeIn: "--",
//     lastSwipeOut: "--",
//     totalHours: "00:00",
//     attendanceToday: false,
//   },
// ];