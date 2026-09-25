import React from "react";

import {
  FiUsers,
  FiRefreshCcw,
  FiDollarSign,
  FiCreditCard,
  FiUserX,
} from "react-icons/fi";

import SalesReturnAction from "./Action/SalesReturnAction";

export const SALES_RETURN_STATUS_OPTIONS = [
  {
    value: "approved",
    label: "Approved",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "refunded",
    label: "Refunded",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

export const SALES_RETURN_REASON_OPTIONS = [
  {
    value: "damaged_product",
    label: "Damaged Product",
  },
  {
    value: "wrong_item",
    label: "Wrong Item",
  },
  {
    value: "quality_issue",
    label: "Quality Issue",
  },
];

export const formatStatusLabel = (value = "") =>
  String(value)
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const formatReasonLabel = (value = "") =>
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

export const getSalesReturnColumns = ({ onDelete }) => [
  {
    header: "Return No",
    accessor: "return_number",
    render: (row) => row.return_number || row.return_no || "-",
  },

  {
    header: "Customer",
    accessor: "customer_name",
    render: (row) =>
      row.customer_name ||
      row.customer?.name ||
      row.customer?.customer_name ||
      row.customer ||
      "-",
  },

  {
    header: "Invoice Ref",
    accessor: "invoice_reference",
    render: (row) =>
      row.invoice_reference ||
      row.invoice_ref ||
      row.invoice?.invoice_number ||
      "-",
  },

  {
    header: "Return Date",
    accessor: "return_date",
    render: (row) => formatDate(row.return_date),
  },

  {
    header: "Return Value",
    accessor: "return_value",
    render: (row) => formatCurrency(row.return_value ?? row.returnValue ?? 0),
  },

  {
    header: "Items Returned",
    accessor: "items_returned",
    render: (row) =>
      row.items_returned ?? row.total_items ?? row.returned_quantity ?? 0,
  },

  {
    header: "Reason",
    accessor: "reason",
    render: (row) => formatReasonLabel(row.reason),
  },

  {
    header: "Status",
    accessor: "status",
    render: (row) => formatStatusLabel(row.status),
  },

  {
    header: "Action",
    accessor: "actions",
    sortable: false,

    render: (row) => <SalesReturnAction row={row} onDelete={onDelete} />,
  },
];

export const buildSalesReturnStats = (kpi = {}) => [
  {
    title: "Total Returns",
    count: kpi.total_returns ?? kpi.total_return ?? 0,
    icon: <FiUsers />,
    backgroundColor: "#E8F8EF",
    iconColor: "#22A06B",
  },

  {
    title: "Return Value",
    count: kpi.return_value ?? kpi.total_return_value ?? 0,
    icon: <FiRefreshCcw />,
    backgroundColor: "#E8F1FF",
    iconColor: "#3478F6",
  },

  {
    title: "Refunded Amount",
    count: kpi.refunded_amount ?? kpi.total_refunded_amount ?? 0,
    icon: <FiDollarSign />,
    backgroundColor: "#FFF4E5",
    iconColor: "#F59E0B",
  },

  {
    title: "Applied Credits",
    count: kpi.applied_credits ?? kpi.total_applied_credits ?? 0,
    icon: <FiCreditCard />,
    backgroundColor: "#FFE8E8",
    iconColor: "#EF4444",
  },

  {
    title: "Cancelled Credits",
    count: kpi.cancelled_credits ?? kpi.cancelled_credit ?? 0,
    icon: <FiUserX />,
    backgroundColor: "#E8F8F8",
    iconColor: "#009688",
  },
];
