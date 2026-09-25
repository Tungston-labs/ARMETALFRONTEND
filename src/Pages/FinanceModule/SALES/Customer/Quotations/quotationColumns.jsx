import React from "react";
import { PiDownloadSimple } from "react-icons/pi";
import { IoClose } from "react-icons/io5";

const formatDate = (dateStr) => {
  if (!dateStr) return "-";

  const d = new Date(dateStr);

  if (isNaN(d)) return dateStr;

  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};



const STATUS_COLORS = {
  draft: "#8A8F98",
  sent: "#3478F6",
  approved: "#22A06B",
  negotiation: "#F59E0B",
  rejected: "#E5484D",
  converted: "#22A06B",
  expired: "#E5484D",
};

export const quotationColumns = [
  {
    header: "Quote No",
    accessor: "quote_number",
    width: "140px",
    sortable: true,
  },

  {
    header: "Issue Date",
    accessor: "issue_date",
    width: "120px",
    sortable: true,
    render: (row) => formatDate(row.issue_date),
  },

  {
    header: "Valid Till",
    accessor: "valid_till",
    width: "130px",
    sortable: true,
    render: (row) => formatDate(row.valid_till),
  },

  {
    header: "Quote Amount",
    accessor: "quote_amount",
    width: "150px",
    sortable: true,

  },

  {
    header: "Negotiation Amount",
    accessor: "negotiation_amount",
    width: "160px",
    sortable: true,

  },

  {
    header: "Status",
    accessor: "status",
    width: "130px",
    sortable: true,
    render: (row) => {
      const status = row.status?.toLowerCase();
      const color = STATUS_COLORS[status] || "#555";

      return (
        <span
          style={{
            color,
            fontSize: "12px",
            fontWeight: 500,
            textTransform: "capitalize",
          }}
        >
          {row.status}
        </span>
      );
    },
  },

 

  {
    header: "Action",
    accessor: "action",
    width: "150px",
    sortable: false,

    render: (row) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          title="View"
          style={{
            width: "32px",
            height: "32px",
            border: "1px solid #E5E7EB",
            background: "#fff",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={() => console.log("View quotation:", row)}
        >
          <PiDownloadSimple size={15} />
        </button>
        <button
          type="button"
          title="Delete"
          style={{
            width: "32px",
            height: "32px",
            border: "1px solid #E5E7EB",
            background: "#fff",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "red",
          }}
          onClick={() => console.log("Delete quotation:", row)}
        >
          <IoClose size={15} />
        </button>
      </div>
    ),
  },
];