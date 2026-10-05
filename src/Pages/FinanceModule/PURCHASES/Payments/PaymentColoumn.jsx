import React from "react";
import { FiEye, FiDownload, FiEdit2, FiTrash2 } from "react-icons/fi";

/* =========================================================
   FORMATTERS
========================================================= */

export const formatStatusLabel = (value = "") => {
  if (!value) {
    return "-";
  }

  return String(value)
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") {
    return "SAR 0.00";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return `SAR ${value}`;
  }

  return `SAR ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatPaymentDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/* =========================================================
   VENDOR
========================================================= */

const getVendorName = (row) => {
  if (row?.vendor_name) {
    return row.vendor_name;
  }

  if (typeof row?.vendor === "string") {
    return row.vendor;
  }

  if (row?.vendor?.name) {
    return row.vendor.name;
  }

  if (row?.vendor?.vendor_name) {
    return row.vendor.vendor_name;
  }

  return "-";
};

/* =========================================================
   BILL
========================================================= */

const getBillNumber = (row) => {
  return (
    row?.bill_number ||
    row?.bill_no ||
    row?.invoice_no ||
    row?.bill?.bill_number ||
    row?.bill?.bill_no ||
    "-"
  );
};

/* =========================================================
   STATUS
========================================================= */

export const getPaymentStatusColor = (status) => {
  switch (String(status).toLowerCase()) {
    case "cleared":
    case "completed":
      return "#008000";

    case "pending":
    case "pending_clearance":
      return "#ff8c00";

    case "failed":
    case "cancelled":
      return "#ef0000";

    default:
      return "#008000";
  }
};

/* =========================================================
   KPI CARDS
========================================================= */

export const buildPurchasePaymentStats = (kpi = {}) => [
  {
    title: "Total Payments Made",
    count: kpi.totalPaymentsMade ?? kpi.total_payments_made ?? 0,
    icon: "payments",
    backgroundColor: "#e8f8f0",
    iconColor: "#008000",
  },

  {
    title: "Total Paid Out",
    count: formatCurrency(kpi.totalPaidOut),
    icon: "paid",
    backgroundColor: "#eee8ff",
    iconColor: "#7c3aed",
  },

  {
    title: "Paid This Month",
    count: formatCurrency(kpi.paidThisMonth),
    icon: "month",
    backgroundColor: "#e8f8ed",
    iconColor: "#22c55e",
  },

  {
    title: "Pending Clearance",
    count: String(kpi.pendingClearance ?? 0).padStart(2, "0"),
    icon: "pending",
    backgroundColor: "#fff2df",
    iconColor: "#f97316",
  },

  {
    title: "Failed Payments",
    count: String(kpi.failedPayments ?? 0).padStart(2, "0"),
    icon: "failed",
    backgroundColor: "#ffe8e8",
    iconColor: "#ef4444",
  },
];

/* =========================================================
   FILTERS
========================================================= */

export const PAYMENT_STATUS_OPTIONS = [
  {
    label: "Cleared",
    value: "cleared",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Failed",
    value: "failed",
  },
];

export const PAYMENT_TYPE_OPTIONS = [
  {
    label: "Full Payment",
    value: "full_payment",
  },
  {
    label: "Partial Payment",
    value: "partial_payment",
  },
  {
    label: "Advance Payment",
    value: "advance_payment",
  },
];

export const PAYMENT_METHOD_OPTIONS = [
  {
    label: "Bank Transfer",
    value: "bank_transfer",
  },
  {
    label: "Cheque",
    value: "cheque",
  },
  {
    label: "Online Payment",
    value: "online_payment",
  },
  {
    label: "Cash",
    value: "cash",
  },
];

/* =========================================================
   TABLE COLUMNS
========================================================= */

export const getPurchasePaymentColumns = ({
  onView,
  onEdit,
  onDelete,
  onDownload,
}) => [
  {
    header: "Payment No",
    accessor: "payment_no",
    render: (row) =>
      row?.payment_no ||
      row?.receipt_no ||
      row?.payment_number ||
      row?.id ||
      "-",
  },

  {
    header: "Vendor",
    accessor: "vendor_name",
    render: (row) => getVendorName(row),
  },

  {
    header: "Against Bill",
    accessor: "bill_number",
    render: (row) => getBillNumber(row),
  },

  {
    header: "Payment Date",
    accessor: "payment_date",
    render: (row) => formatPaymentDate(row?.payment_date),
  },

  {
    header: "Payment Type",
    accessor: "payment_type",
    render: (row) => formatStatusLabel(row?.payment_type),
  },

  {
    header: "Payment Method",
    accessor: "payment_method",
    render: (row) => formatStatusLabel(row?.payment_method),
  },

  {
    header: "Amount",
    accessor: "amount",
    render: (row) =>
      formatCurrency(
        row?.amount ?? row?.amount_received ?? row?.received_amount,
      ),
  },

  {
    header: "Status",
    accessor: "status",
    render: (row) => {
      const status = row?.status || row?.payment_status || "";

      return (
        <span
          style={{
            color: getPaymentStatusColor(status),
          }}
        >
          {formatStatusLabel(status)}
        </span>
      );
    },
  },

  {
    header: "Action",
    accessor: "actions",
    sortable: false,

    render: (row) => (
      <div
        style={{
          display: "flex",
          gap: "7px",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          onClick={() => onView?.(row)}
          title="View Payment"
          style={buttonStyle}
        >
          <FiEye size={13} />
        </button>

        <button
          type="button"
          onClick={() => onDownload?.(row)}
          title="Download Payment"
          style={buttonStyle}
        >
          <FiDownload size={13} />
        </button>

        {String(row?.status || row?.payment_status || "").toLowerCase() ===
          "pending" && (
          <>
            <button
              type="button"
              onClick={() => onEdit?.(row)}
              title="Edit Payment"
              style={buttonStyle}
            >
              <FiEdit2 size={13} />
            </button>

            <button
              type="button"
              onClick={() => onDelete?.(row)}
              title="Delete Payment"
              style={{
                ...buttonStyle,
                color: "#ef4444",
              }}
            >
              <FiTrash2 size={13} />
            </button>
          </>
        )}
      </div>
    ),
  },
];

const buttonStyle = {
  width: "25px",
  height: "25px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  border: "1px solid #e5e7eb",
  borderRadius: "5px",
  background: "#ffffff",
  color: "#111827",
  cursor: "pointer",
};
