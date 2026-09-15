import React from "react";
import { PiDownloadSimple } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
export const quotationColumns = [
  {
    header: "Quotation No",
    accessor: "quotationNo",
    width: "140px",
    sortable: true,
  },

  {
    header: "Date",
    accessor: "date",
    width: "120px",
    sortable: true,
  },

  {
    header: "Reference",
    accessor: "reference",
    width: "180px",
    sortable: true,
  },

  {
    header: "Amount",
    accessor: "amount",
    width: "150px",
    sortable: true,
  },

 {
  header: "Status",
  accessor: "status",
  width: "130px",
  sortable: true,

  render: (row) => {
    const status = row.status?.toLowerCase();

    let color = "#555";

    if (status === "approved") {
      color = "#22A06B";
    }

    if (status === "negotiation") {
      color = "#F59E0B";
    }

    if (status === "rejected") {
      color = "#E5484D";
    }

    return (
      <span
        style={{
          color,
          fontSize: "12px",
          fontWeight: 500,
        }}
      >
        {row.status}
      </span>
    );
  },
},

  {
    header: "Valid Until",
    accessor: "validUntil",
    width: "130px",
    sortable: true,
  },

  {
    header: "Created By",
    accessor: "createdBy",
    width: "140px",
    sortable: true,
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
            color:"red"
          }}
          onClick={() => console.log("Delete quotation:", row)}
        >
          <IoClose size={15} />
        </button>
      </div>
    ),
  },
];