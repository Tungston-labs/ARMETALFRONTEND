import React from "react";
import {
  ActionButtons,
  ApproveButton,
  RejectButton,
} from "./leaveColumns.style";
import { FaRegMessage } from "react-icons/fa6";
import { FaCalendarCheck } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import { MdFreeCancellation } from "react-icons/md";

export const getLeaveColumns = ({
  page,
  formatDate,
  openApproveModal,
  openRejectModal,
}) => [
  {
    header: "Sl No",
    accessor: "slNo",
    sortable: false,
    width: "60px",
    render: (row, index) => index + 1 + (page - 1) * 20,
  },

  {
    header: "Employee Name",
    accessor: "employee",
    sortable: false,
    render: (row) => row.employee?.name || "-",
  },

  {
    header: "Leave Type",
    accessor: "leave_type",
    render: (row) =>
      row.leave_type
        ? row.leave_type.charAt(0).toUpperCase() +
          row.leave_type.slice(1)
        : "-",
  },

  {
    header: "Department",
    accessor: "department",
    sortable: false,
    render: (row) => row.employee?.department || "-",
  },

 {
  header: "Applied Date",
  accessor: "applied_date",
  sortable: false,
  render: (row) => formatDate(row.created_at),
},
 {
  header: "Start & End Date",
  accessor: "date",
  sortable: false,
  render: (row) => {
    const start = formatDate(row.from_date);
    const end = formatDate(row.to_date);

    // single day + half a day => show "Half Day"
    if (start === end) {
      return (
        <span>
          {start}
          {Number(row.leave_days) === 0.5 && " (Half Day)"}
        </span>
      );
    }

    return (
      <span>
        {start} - {end}
      </span>
    );
  },
},

  {
    header: "Leave Balance",
    accessor: "leave_balance",
    sortable: false,
    render: (row) => row.employee?.total_leave ?? "0",
  },

  {
    header: "No Of Days",
    accessor: "no_of_days",
    sortable: false,
    render: (row) => row.leave_days ?? "0",
  },

  {
    header: "Reason",
    accessor: "reason",
    sortable: false,
    render: (row) => {
      const reason = row.reason || "-";

      return (
        <span
          title={reason}
          style={{
            display: "inline-block",
            maxWidth: "100px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            cursor: "pointer",
          }}
        >
          {reason}
        </span>
      );
    },
  },

  {
    header: "Status",
    accessor: "status",
    sortable: false,
    render: (row) => (
      <span
        style={{
          fontWeight: 600,
          color:
            row.status === "approved"
              ? "#16a34a"
              : row.status === "rejected"
              ? "#dc2626"
              : "#f59e0b",
        }}
      >
        {row.status
          ? row.status.charAt(0).toUpperCase() + row.status.slice(1)
          : "Pending"}
      </span>
    ),
  },

  {
    header: "",
    accessor: "actions",
    sortable: false,
    render: (row) => {
      const currentStatus = row.status?.toLowerCase();

      return (
        <div onClick={(e) => e.stopPropagation()}>
          <ActionButtons>
            {currentStatus === "pending" && (
              <>
                <ApproveButton
                  onClick={() => openApproveModal(row.id)}
                >
                  Approve
                </ApproveButton>

                <RejectButton
                  onClick={() => openRejectModal(row.id)}
                >
                  Reject
                </RejectButton>
              </>
            )}

            {currentStatus === "approved" && (
              <RejectButton
                onClick={() => openRejectModal(row.id)}
              >
                Reject
              </RejectButton>
            )}

            {currentStatus === "rejected" && (
              <ApproveButton
                onClick={() => openApproveModal(row.id)}
              >
                Approve
              </ApproveButton>
            )}
          </ActionButtons>
        </div>
      );
    },
  },
];

export const getPayrollCards = ({
  total = 0,
  pending = 0,
  approved = 0,
  rejected = 0,
} = {}) => [
  {
    title: "All Leave Request",
    count: total,
    icon: <FaRegMessage />,
    iconColor: "#157baa",
    backgroundColor: "#e3f5f7",
  },

  {
    title: "Pending Request",
    count: pending,
    icon: <MdOutlinePendingActions />,
    iconColor: "#ffa600",
    backgroundColor: "#fdf2e4",
  },

  {
    title: "Approved Request",
    count: approved,
    icon: <FaCalendarCheck />,
    iconColor: "#309e48",
    backgroundColor: "#caf7dd",
  },

  {
    title: "Rejected Request",
    count: rejected,
    icon: <MdFreeCancellation />,
    iconColor: "#aa1a15",
    backgroundColor: "#f0d0d0",
  },
];