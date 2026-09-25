import React from "react";
import {
  FiInfo,
  FiUsers,
  FiDollarSign,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";

export const formatStatusLabel = (value = "") =>
  String(value)
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return value;
  }

  return `SAR ${amount.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;
};

const formatPaymentDate = (value) => {
  if (!value) return "-";

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

const getCustomerName = (row) => {
  if (row.customer_name) return row.customer_name;

  if (typeof row.customer === "string") {
    return row.customer;
  }

  if (row.customer?.name) {
    return row.customer.name;
  }

  return "-";
};

const getStatusColor = (status) => {
  switch (String(status).toLowerCase()) {
    case "completed":
      return "#008000";

    case "cancelled":
      return "#FF0000";

    case "pending":
      return "#FF8C00";

    default:
      return "#008000";
  }
};

/* =========================================================
   KPI CARDS
========================================================= */

export const buildPaymentStats = (kpi = {}) => [
  {
    title: "Total Collections",
    count: formatCurrency(kpi.totalCollections),
    icon: <FiUsers />,
    backgroundColor: "#e8f8f0",
    iconColor: "#008000",
  },
  {
    title: "This Month Collections",
    count: formatCurrency(kpi.thisMonthCollections),
    icon: <FiUsers />,
    backgroundColor: "#e9efff",
    iconColor: "#3152b8",
  },
  {
    title: "Outstanding Receivables",
    count: formatCurrency(kpi.outstandingReceivables),
    icon: <FiUsers />,
    backgroundColor: "#fff3df",
    iconColor: "#f59e0b",
  },
  {
    title: "Overdue Receivables",
    count: formatCurrency(kpi.overdueReceivables),
    icon: <FiAlertCircle />,
    backgroundColor: "#ffe7e7",
    iconColor: "#ef4444",
  },
  {
    title: "Collection Rate",
    count: `${Number(kpi.collectionRate || 0)}%`,
    icon: <FiUsers />,
    backgroundColor: "#e5f6f8",
    iconColor: "#008000",
  },
];

/* =========================================================
   FILTER OPTIONS
========================================================= */

export const PAYMENT_STATUS_OPTIONS = [
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
  {
    label: "Pending",
    value: "pending",
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

export const getPaymentColumns = ({ onInfo }) => [
  {
    header: "Receipt No",
    accessor: "receipt_no",
  },

  {
    header: "Customer",
    accessor: "customer_name",
    render: (row) => getCustomerName(row),
  },

  {
    header: "Invoice No",
    accessor: "invoice_no",
  },

  {
    header: "Payment Date",
    accessor: "payment_date",
    render: (row) => formatPaymentDate(row.payment_date),
  },

  {
    header: "Payment Type",
    accessor: "payment_type",
    render: (row) => formatStatusLabel(row.payment_type),
  },

  {
    header: "Payment Method",
    accessor: "payment_method",
    render: (row) => formatStatusLabel(row.payment_method),
  },

  {
    header: "Amount",
    accessor: "amount",
    render: (row) =>
      formatCurrency(row.amount ?? row.amount_received ?? row.received_amount),
  },

  {
    header: "Status",
    accessor: "status",
    render: (row) => {
      const status = row.status || row.payment_status || "";

      return (
        <span
          style={{
            color: getStatusColor(status),
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
      <button
        type="button"
        onClick={() => onInfo?.(row)}
        style={{
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
        }}
        aria-label={`View payment ${row.receipt_no || row.id}`}
      >
        <FiInfo size={13} />
      </button>
    ),
  },
];
