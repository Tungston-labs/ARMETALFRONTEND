import React from "react";
import { PiDownloadSimple } from "react-icons/pi";
import { FiEdit2 } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatCurrency = (value, currency = "SAR") => {
  if (value === null || value === undefined || value === "") return "------";
  const num = Number(value);
  if (Number.isNaN(num) || num <= 0) return "------";
  return `${currency || "SAR"} ${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const STATUS_COLORS = {
  draft: "#3b82f6",
  sent: "#3b82f6",
  approved: "#16a34a",
  pending: "#f59e0b",
  negotiation: "#f59e0b",
  rejected: "#ef4444",
  converted: "#16a34a",
  expired: "#ef4444",
};

export const getCustomerQuotationColumns = ({
  currency = "SAR",
  onView,
  onEdit,
  onDelete,
  onStatusChange,
} = {}) => [
  {
    header: "Quote No.",
    accessor: "quote_number",
    sortable: true,
    render: (row) => (
      <span style={{ fontWeight: 500, color: "#1e293b" }}>
        {row.quote_number || "—"}
      </span>
    ),
  },
  {
    header: "Issue Date",
    accessor: "issue_date",
    sortable: true,
    render: (row) => formatDate(row.issue_date),
  },
  {
    header: "Valid Till",
    accessor: "valid_till",
    sortable: true,
    render: (row) => formatDate(row.valid_till),
  },
  {
    header: "Quote Amount",
    accessor: "quote_amount",
    sortable: true,
    render: (row) => {
      const val = Number(row.quote_amount ?? 0);
      return `${row.currency || currency} ${(Number.isFinite(val) ? val : 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  {
    header: "Negotiation Amount",
    accessor: "negotiation_amount",
    sortable: true,
    render: (row) => formatCurrency(row.negotiation_amount, row.currency || currency),
  },
  {
    header: "Status",
    accessor: "status",
    sortable: true,
    render: (row) => {
      const normalized = String(row.status || "pending").toLowerCase();
      const color = STATUS_COLORS[normalized] || "#555";
      if (normalized === "converted") {
        return (
          <span
            style={{
              color,
              fontSize: "12.5px",
              fontWeight: 500,
              textTransform: "capitalize",
            }}
          >
            Converted
          </span>
        );
      }
      return (
        <select
          value={normalized}
          aria-label={`Change status for ${row.quote_number || "quotation"}`}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onStatusChange?.(row, e.target.value)}
          style={{
            height: "28px",
            padding: "0 6px",
            border: "1px solid #e5e7eb",
            borderRadius: "4px",
            background: "#fff",
            color,
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      );
    },
  },
  {
    header: "Action",
    accessor: "action",
    sortable: false,
    render: (row) => {
      const normalized = String(row.status || "").toLowerCase();
      const canEdit =
        normalized === "draft" ||
        normalized === "pending" ||
        normalized === "rejected" ||
        normalized === "sent";
      const canDelete =
        normalized === "draft" ||
        normalized === "pending" ||
        normalized === "rejected";

      return (
        <div
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            title="View / Download"
            style={{
              width: "28px",
              height: "28px",
              border: "1px solid #E5E7EB",
              background: "#fff",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={() => onView?.(row)}
          >
            <PiDownloadSimple size={14} />
          </button>

          {canEdit && (
            <button
              type="button"
              title="Edit"
              style={{
                width: "28px",
                height: "28px",
                border: "1px solid #E5E7EB",
                background: "#fff",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#374151",
              }}
              onClick={() => onEdit?.(row)}
            >
              <FiEdit2 size={13} />
            </button>
          )}

          {canDelete && (
            <button
              type="button"
              title="Delete"
              style={{
                width: "28px",
                height: "28px",
                border: "1px solid #E5E7EB",
                background: "#fff",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#ef4444",
              }}
              onClick={() => onDelete?.(row)}
            >
              <IoClose size={14} />
            </button>
          )}
        </div>
      );
    },
  },
];

export const quotationColumns = getCustomerQuotationColumns();
quotationColumns.build = getCustomerQuotationColumns;
