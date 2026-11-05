import React from "react";

import {
  FiRefreshCcw,
  FiDollarSign,
  FiCalendar,
  FiClock,
  FiFileText,
} from "react-icons/fi";

import SalesReturnAction from "./action/SalesReturnAction";

/* --------------------------------------------------
   Status Options
-------------------------------------------------- */

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

/* --------------------------------------------------
   Reason Options
-------------------------------------------------- */

export const SALES_RETURN_REASON_OPTIONS = [
  {
    value: "damaged_in_transit",
    label: "Damaged in Transit",
  },
  {
    value: "damaged_product",
    label: "Damaged Product",
  },
  {
    value: "wrong_item_delivered",
    label: "Wrong Item Delivered",
  },
  {
    value: "wrong_item",
    label: "Wrong Item",
  },
  {
    value: "quality_issue",
    label: "Quality Issue",
  },
  {
    value: "excess_delivery",
    label: "Excess Delivery",
  },
  {
    value: "customer_changed_mind",
    label: "Customer Changed Mind",
  },
];

/* --------------------------------------------------
   Formatting Helpers
-------------------------------------------------- */

export const formatStatusLabel = (value = "") =>
  String(value)
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const formatReasonLabel = (value = "") => {
  if (!value) {
    return "-";
  }

  const reason = String(value).toLowerCase();

  const reasonMap = {
    damaged_in_transit: "Damaged in Transit",
    damaged_product: "Damaged Product",
    wrong_item_delivered: "Wrong Item Delivered",
    wrong_item: "Wrong Item",
    quality_issue: "Quality Issue",
    excess_delivery: "Excess Delivery",
    customer_changed_mind: "Customer Changed Mind",
  };

  return (
    reasonMap[reason] ||
    String(value)
      .split("_")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
};

export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return value;
  }

  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  // Avoid timezone shifting for date-only API values.
  const dateString = String(value).split("T")[0];
  const parts = dateString.split("-");

  const date =
    parts.length === 3
      ? new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/* --------------------------------------------------
   Sales Return Table Columns
-------------------------------------------------- */

export const getSalesReturnColumns = ({ onDelete }) => [
  {
    header: "Return No",
    accessor: "return_number",

    render: (row) =>
      row.return_number || row.return_no || row.return_number_display || "-",
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
      row.invoice_number ||
      "-",
  },

  {
    header: "Return Date",
    accessor: "return_date",

    render: (row) => formatDate(row.return_date),
  },

  {
    header: "Reason",
    accessor: "reason",

    render: (row) => formatReasonLabel(row.reason),
  },

  {
    header: "Qty Returned",
    accessor: "quantity_returned",

    render: (row) =>
      row.quantity_returned ??
      row.qty_returned ??
      row.items_returned ??
      row.total_items ??
      row.returned_quantity ??
      0,
  },

  {
    header: "Return Amt (SAR)",
    accessor: "return_amount",

    render: (row) =>
      formatCurrency(
        row.return_amount ??
          row.return_value ??
          row.returnValue ??
          row.total_return_amount ??
          0,
      ),
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

/* --------------------------------------------------
   Sales Return KPI Cards
-------------------------------------------------- */

export const buildSalesReturnStats = (kpi = {}) => [
  {
    title: "Total Returns",

    count: kpi.total_returns ?? kpi.total_return ?? 0,

    icon: <FiFileText />,

    backgroundColor: "#E8F8EF",
    iconColor: "#16803C",
  },

  {
    title: "Total Return Value",

    count: kpi.total_return_value ?? kpi.return_value ?? 0,

    icon: <FiCalendar />,

    backgroundColor: "#F3E8FF",
    iconColor: "#9333EA",
  },

  {
    title: "Refunded Amount",

    count: kpi.refunded_amount ?? kpi.total_refunded_amount ?? 0,

    icon: <FiRefreshCcw />,

    backgroundColor: "#E8F8EF",
    iconColor: "#16A34A",
  },

  {
    title: "Requested",

    count:
      kpi.requested ??
      kpi.requested_returns ??
      kpi.total_requested ??
      kpi.applied_credits ??
      0,

    icon: <FiCalendar />,

    backgroundColor: "#FFF4E5",
    iconColor: "#F97316",
  },

  {
    title: "Pending",

    count: kpi.pending ?? kpi.pending_returns ?? kpi.total_pending ?? 0,

    icon: <FiClock />,

    backgroundColor: "#FFE8E8",
    iconColor: "#EF4444",
  },
];
