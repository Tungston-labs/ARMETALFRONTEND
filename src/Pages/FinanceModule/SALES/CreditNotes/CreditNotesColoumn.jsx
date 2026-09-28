import React from "react";

import {
  FiCreditCard,
  FiDollarSign,
  FiUserCheck,
  FiUserX,
  FiUserMinus,
} from "react-icons/fi";

import CreditAction from "./action/CreditAction";

/* =========================================================
   DATE
========================================================= */

const formatCreditDate = (date) => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/* =========================================================
   AMOUNT
========================================================= */

const formatAmount = (value) => {
  if (value === null || value === undefined || value === "") {
    return "SAR 0";
  }

  const number = Number(
    String(value).replace(/SAR/gi, "").replace(/,/g, "").trim(),
  );

  if (!Number.isNaN(number)) {
    return `SAR ${number.toLocaleString("en-US")}`;
  }

  const stringValue = String(value);

  return stringValue.toUpperCase().includes("SAR")
    ? stringValue
    : `SAR ${stringValue}`;
};

/* =========================================================
   CUSTOMER
========================================================= */

const getCustomerName = (row) => {
  const customer = row?.customer;

  if (customer && typeof customer === "object") {
    return (
      customer?.name || customer?.customer_name || customer?.company_name || "-"
    );
  }

  return customer || row?.customer_name || "-";
};

/* =========================================================
   STATUS
========================================================= */

const formatStatus = (value) => {
  if (!value) {
    return "-";
  }

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/* =========================================================
   COLUMNS
========================================================= */

export const creditNoteColumns = (onDelete) => [
  {
    header: "Credit Note No",
    accessor: "creditNoteNumber",

    render: (row) =>
      row?.credit_note_number || row?.creditNoteNumber || row?.number || "-",
  },

  {
    header: "Customer",
    accessor: "customer",

    render: (row) => getCustomerName(row),
  },

  {
    header: "Invoice Ref",
    accessor: "invoiceReference",

    render: (row) =>
      row?.invoice_reference ||
      row?.invoiceReference ||
      row?.invoice_ref ||
      "-",
  },

  {
    header: "Issue Date",
    accessor: "issueDate",

    render: (row) => formatCreditDate(row?.issue_date || row?.issueDate),
  },

  {
    header: "Reason",
    accessor: "reason",

    render: (row) => formatStatus(row?.reason),
  },

  {
    header: "Credit Amount",
    accessor: "creditAmount",

    render: (row) =>
      formatAmount(
        row?.credit_amount ??
          row?.creditAmount ??
          row?.this_credit_note ??
          row?.thisCreditNote ??
          row?.total_credit_amount,
      ),
  },

  {
    header: "Applied Amount",
    accessor: "appliedAmount",

    render: (row) =>
      formatAmount(
        row?.applied_amount ?? row?.appliedAmount ?? row?.already_credited,
      ),
  },

  {
    header: "Balance",
    accessor: "balance",

    render: (row) =>
      formatAmount(
        row?.balance ?? row?.remaining_balance ?? row?.remainingBalance,
      ),
  },

  {
    header: "Status",
    accessor: "status",

    render: (row) =>
      formatStatus(row?.status || row?.credit_status || row?.creditStatus),
  },

  {
    header: "Action",
    accessor: "actions",
    sortable: false,

    render: (row) => <CreditAction row={row} onDelete={onDelete} />,
  },
];

/* =========================================================
   STATS
========================================================= */

export const creditNoteStats = (stats) => [
  {
    title: "Total Credit Notes",
    count: stats.totalCreditNotes,
    icon: <FiCreditCard />,
    backgroundColor: "#E8F8EF",
    iconColor: "#22A06B",
  },

  {
    title: "Total Credit Value",
    count: stats.totalCreditValue,
    icon: <FiDollarSign />,
    backgroundColor: "#E8F1FF",
    iconColor: "#3478F6",
  },

  {
    title: "Open Credits",
    count: stats.openCredits,
    icon: <FiUserCheck />,
    backgroundColor: "#FFF4E5",
    iconColor: "#F59E0B",
  },

  {
    title: "Applied Credits",
    count: stats.appliedCredits,
    icon: <FiUserMinus />,
    backgroundColor: "#FDECEC",
    iconColor: "#E5484D",
  },

  {
    title: "Cancelled Credits",
    count: stats.cancelledCredits,
    icon: <FiUserX />,
    backgroundColor: "#E5F6FA",
    iconColor: "#00A86B",
  },
];
