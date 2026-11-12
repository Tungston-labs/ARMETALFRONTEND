import React from "react";
import { FiEye } from "react-icons/fi";
import Paymentactions from "./action/Paymentaction";

/* =========================================================
   FORMAT STATUS LABEL
========================================================= */

export const formatStatusLabel = (value = "") =>
  String(value)
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/* =========================================================
   FORMAT CURRENCY
========================================================= */

export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return value;
  }

  return `SAR ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/* =========================================================
   FORMAT PAYMENT DATE
========================================================= */

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

/* =========================================================
   CUSTOMER NAME
========================================================= */

const getCustomerName = (row) => {
  if (row.customer_name) {
    return row.customer_name;
  }

  if (typeof row.customer === "string") {
    return row.customer;
  }

  if (row.customer?.name) {
    return row.customer.name;
  }

  return "-";
};

/* =========================================================
   PAYMENT NUMBER
========================================================= */

const getPaymentNumber = (row) => {
  return (
    row.payment_no ||
    row.payment_number ||
    row.receipt_no ||
    row.receipt_number ||
    "-"
  );
};

/* =========================================================
   INVOICE REFERENCE
========================================================= */

const getInvoiceReference = (row) => {
  return (
    row.invoice_reference ||
    row.invoice_ref ||
    row.invoice_no ||
    row.invoice_number ||
    row.invoice?.invoice_no ||
    row.invoice?.invoice_number ||
    "-"
  );
};

/* =========================================================
   PAYMENT STATUS
========================================================= */

const getPaymentStatus = (row) => {
  const status = String(row.status || row.payment_status || "")
    .toLowerCase()
    .replace(/\s+/g, "_");

  switch (status) {
    case "completed":
    case "fully_paid":
    case "paid":
      return "Fully Paid";

    case "partially_paid":
    case "partial":
    case "partially_completed":
      return "Partially Paid";

    case "pending":
      return "Pending";

    case "cancelled":
    case "canceled":
      return "Cancelled";

    case "overdue":
      return "Overdue";

    default:
      return formatStatusLabel(status) || "-";
  }
};

/* =========================================================
   STATUS COLOR
========================================================= */

const getStatusColor = (status) => {
  switch (status) {
    case "Fully Paid":
      return "#008000";

    case "Partially Paid":
      return "#ff8500";

    case "Pending":
      return "#3152b8";

    case "Cancelled":
      return "#ff0000";

    case "Overdue":
      return "#ff0000";

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
    icon: <span />,
    backgroundColor: "#e8f8f0",
    iconColor: "#008000",
  },
  {
    title: "This Month Collections",
    count: formatCurrency(kpi.thisMonthCollections),
    icon: <span />,
    backgroundColor: "#e9efff",
    iconColor: "#3152b8",
  },
  {
    title: "Outstanding Receivables",
    count: formatCurrency(kpi.outstandingReceivables),
    icon: <span />,
    backgroundColor: "#fff3df",
    iconColor: "#f59e0b",
  },
  {
    title: "Overdue Receivables",
    count: formatCurrency(kpi.overdueReceivables),
    icon: <span />,
    backgroundColor: "#ffe7e7",
    iconColor: "#ef4444",
  },
  {
    title: "Collection Rate",
    count: `${Number(kpi.collectionRate || 0)}%`,
    icon: <span />,
    backgroundColor: "#e5f6f8",
    iconColor: "#008000",
  },
];

/* =========================================================
   FILTER OPTIONS
========================================================= */

export const PAYMENT_STATUS_OPTIONS = [
  {
    label: "Fully Paid",
    value: "completed",
  },
  {
    label: "Partially Paid",
    value: "partially_paid",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Cancelled",
    value: "cancelled",
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
    header: "Payment no.",
    accessor: "receipt_no",
    render: (row) => getPaymentNumber(row),
  },

  {
    header: "Customer",
    accessor: "customer_name",
    render: (row) => getCustomerName(row),
  },

  {
    header: "Invoice ref",
    accessor: "invoice_no",
    render: (row) => (
      <span
        style={{
          textDecoration: "underline",
          cursor: "pointer",
          color: "#333333",
        }}
      >
        {getInvoiceReference(row)}
      </span>
    ),
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
      const status = getPaymentStatus(row);

      return (
        <span
          style={{
            color: getStatusColor(status),
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          {status}
        </span>
      );
    },
  },

  {
  header: "Action",
  accessor: "actions",
  sortable: false,
  render: (row) => <Paymentactions row={row} onInfo={onInfo} />,
},
];
