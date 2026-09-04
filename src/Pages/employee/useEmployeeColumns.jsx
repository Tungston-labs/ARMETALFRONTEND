import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { TruncatedText } from "../leaveDetails/EmployeeList.styles";
import { Status } from "../../Components/ReusableTable/ReusableTable.styles";

/**
 * Returns the column definitions for the Employee table.
 *
 * @param {Object} params
 * @param {number} params.page - current page number
 * @param {number} params.paginationLimit - rows per page
 * @param {Function} params.navigate - react-router navigate fn
 * @param {Function} params.onDeleteClick - handler invoked with employee id
 */
export const useEmployeeColumns = ({ page, paginationLimit, navigate, onDeleteClick }) => {
  return [
    {
      header: "Sl No",
      accessor: "slno",
      sortable: false,
      render: (_row, index) => index + 1 + (page - 1) * paginationLimit,
    },
    {
      header: "Employee name",
      accessor: "name",
      
    },
    { header: "Email", accessor: "email" },
    { header: "Employee ID", accessor: "employee_code" },
    {
      header: "Job Position",
      accessor: "designation",
      render: (row) => (
        <TruncatedText title={row.designation?.toUpperCase()}>
          {row.designation?.toUpperCase()}
        </TruncatedText>
      ),
    },
    {
      header: "Department",
      accessor: "department",
      render: (row) => <TruncatedText title={row.department}>{row.department}</TruncatedText>,
    },
{
  header: "Status",
  accessor: "status",
  sortable: false,
  render: (row) => {
    const status = row.today_attendance_status
      ? row.today_attendance_status
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : "N/A";

    return (
      <Status $status={status}>
        {status}
      </Status>
    );
  },
},
    {
      header: "Action",
      accessor: "action",
      sortable: false,
      render: (row) => (
        <div style={{ display: "flex", gap: 12 }}>
          <FaEdit
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/ViewBasic/${row.id}`);
            }}
          />
          <FaTrash
            color="red"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(row.id);
            }}
          />
        </div>
      ),
    },
  ];
};