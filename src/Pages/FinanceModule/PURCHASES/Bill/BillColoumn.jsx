import React from "react";

import {
  FiUsers,
  FiDollarSign,
  FiFileText,
  FiAlertCircle,
  FiCreditCard,
} from "react-icons/fi";

import BillAction from "./action/BillAction";

/* =========================================================
   BILL STATUS OPTIONS
========================================================= */

export const BILL_STATUS_OPTIONS = [
  {
    value: "fully_paid",
    label: "Fully Paid",
  },
  {
    value: "partially_paid",
    label: "Partially Paid",
  },
  {
    value: "not_paid",
    label: "Not Paid",
  },
];

/* =========================================================
   BILL PAYMENT STATUS OPTIONS
========================================================= */

export const BILL_PAYMENT_STATUS_OPTIONS = [
  {
    value: "fully_paid",
    label: "Fully Paid",
  },
  {
    value: "partially_paid",
    label: "Partially Paid",
  },
  {
    value: "not_paid",
    label: "Not Paid",
  },
];

/* =========================================================
   FORMAT STATUS
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
    maximumFractionDigits: 0,
  })}`;
};

/* =========================================================
   FORMAT DATE
========================================================= */

export const formatDate = (value) => {
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
   BILL TABLE COLUMNS
========================================================= */

export const getBillColumns = ({ onDelete }) => [
  {
    header: "Invoice No",
    accessor: "invoice_number",

    render: (row) =>
      row.invoice_number ||
      row.invoice_no ||
      row.bill_number ||
      row.bill_no ||
      "-",
  },

  {
    header: "PO Ref",
    accessor: "po_reference",

    render: (row) =>
      row.po_reference ||
      row.po_ref ||
      row.purchase_order_reference ||
      row.purchase_order?.reference ||
      row.purchase_order?.po_number ||
      "-",
  },

  {
    header: "Vendor",
    accessor: "vendor_name",

    render: (row) =>
      row.vendor_name ||
      row.vendor?.name ||
      row.vendor?.vendor_name ||
      row.vendor ||
      "-",
  },

  {
    header: "Bill Date",
    accessor: "bill_date",

    render: (row) => formatDate(row.bill_date || row.invoice_date || row.date),
  },

  {
    header: "Due Date",
    accessor: "due_date",

    render: (row) => formatDate(row.due_date),
  },

  {
    header: "Amount",
    accessor: "amount",

    render: (row) =>
      formatCurrency(
        row.amount ??
          row.total_amount ??
          row.bill_amount ??
          row.total ??
          row.invoice_value ??
          0,
      ),
  },

  {
    header: "Paid",
    accessor: "paid",

    render: (row) =>
      formatCurrency(
        row.paid ?? row.paid_amount ?? row.amount_paid ?? row.total_paid ?? 0,
      ),
  },

  {
    header: "Balance",
    accessor: "balance",

    render: (row) =>
      formatCurrency(
        row.balance ??
          row.balance_amount ??
          row.outstanding_amount ??
          row.amount_due ??
          0,
      ),
  },

  {
    header: "Payment Status",
    accessor: "payment_status",

    render: (row) =>
      formatStatusLabel(
        row.payment_status || row.paymentStatus || row.status || "not_paid",
      ),
  },

  {
    header: "Action",
    accessor: "actions",
    sortable: false,

    render: (row) => <BillAction row={row} onDelete={onDelete} />,
  },
];

/* =========================================================
   BILL KPI CARDS
========================================================= */

export const buildBillStats = (kpi = {}) => [
  {
    title: "Total Bill Value",

    count: kpi.total_bill_value ?? kpi.total_value ?? kpi.bill_value ?? 0,

    icon: <FiUsers />,

    backgroundColor: "#E8F8EF",

    iconColor: "#22A06B",
  },

  {
    title: "Total Payables",

    count: kpi.total_payables ?? kpi.total_payable ?? kpi.payables ?? 0,

    icon: <FiDollarSign />,

    backgroundColor: "#E8F1FF",

    iconColor: "#3478F6",
  },

  {
    title: "Total Debit Notes",

    count: kpi.total_debit_notes ?? kpi.debit_notes ?? 0,

    icon: <FiFileText />,

    backgroundColor: "#FFF4E5",

    iconColor: "#F59E0B",
  },

  {
    title: "Overdue Payables",

    count:
      kpi.overdue_payables ?? kpi.overdue_payable ?? kpi.overdue_amount ?? 0,

    icon: <FiAlertCircle />,

    backgroundColor: "#FFE8E8",

    iconColor: "#EF4444",
  },

  {
    title: "Total Bill",

    count: kpi.total_bills ?? kpi.bill_count ?? kpi.total_bill ?? 0,

    icon: <FiCreditCard />,

    backgroundColor: "#E8F8F8",

    iconColor: "#009688",
  },
];
