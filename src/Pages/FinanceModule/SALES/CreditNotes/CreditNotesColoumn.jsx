import React from "react";

import {
  FiCreditCard,
  FiDollarSign,
  FiUserCheck,
  FiUserX,
  FiUserMinus,
} from "react-icons/fi";

import CreditAction from "./action/CreditAction";
import { formatDate } from "../../../../utils/Formatdate";


/* =========================================================
   AMOUNT
========================================================= */

const formatAmount = (value) => {
  if (value === null || value === undefined || value === "" || value === "-") {
    return "-";
  }

  const number = Number(
    String(value).replace(/SAR/gi, "").replace(/,/g, "").trim(),
  );

  if (!Number.isNaN(number)) {
    return `SAR ${number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
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
  if (row?.customer && typeof row.customer === "object") {
    return (
      row.customer?.customer_name ||
      row.customer?.name ||
      row.customer?.company_name ||
      "-"
    );
  }

  return (
    row?.customer_name ||
    row?.customer_company ||
    (typeof row?.customer === "string" ? row.customer : null) ||
    "-"
  );
};

/* =========================================================
   STATUS
========================================================= */

const formatStatus = (value) => {
  if (!value) {
    return "-";
  }

  const normalized = String(value).toLowerCase();
  if (normalized === "open") return "Pending";
  if (normalized === "closed" || normalized === "applied") return "Applied";
  if (normalized === "partially_applied") return "Partially Applied";
  if (normalized === "cancelled") return "Cancelled";

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/* =========================================================
   COLUMNS
========================================================= */

export const creditNoteColumns = (onDelete) => [
  {
    header: "CN No",
    accessor: "creditNoteNumber",
    width: "105px",

    render: (row) =>
      row?.cn_number ||
      row?.credit_note_number ||
      row?.creditNoteNumber ||
      row?.number ||
      "-",
  },

  {
    header: "Customer",
    accessor: "customer",
    width: "160px",

    render: (row) => getCustomerName(row),
  },

  {
    header: "Invoice Ref",
    accessor: "invoiceReference",
    width: "110px",

    render: (row) =>
      row?.invoice_ref ||
      row?.invoice_reference ||
      row?.invoiceReference ||
      "-",
  },

  {
    header: "Date Issued",
    accessor: "issueDate",
    width: "110px",

    render: (row) => formatDate(row?.issue_date || row?.issueDate),
  },

  {
    header: "Reason",
    accessor: "reason",
    width: "125px",

    render: (row) => {
      const reasonMap = {
        sales_return: "Sales Return",
        price_adjustment: "Price Adjustment",
        damaged_goods: "Damaged Goods",
        discount_adjustment: "Discount Adjustment",
        pricing_error: "Pricing Error",
      };
      return reasonMap[row?.reason] || formatStatus(row?.reason);
    },
  },

  {
    header: (
      <div style={{ lineHeight: "1.2", fontSize: "12px", whiteSpace: "normal" }}>
        Invoice Amt
        <div style={{ fontSize: "11px", opacity: 0.85 }}>(SAR)</div>
      </div>
    ),
    accessor: "invoiceAmount",
    width: "125px",

    render: (row) => {
      const val =
        row?.invoice_amount ??
        row?.invoice_value ??
        row?.invoice?.total_amount;
      if (val === null || val === undefined || val === "" || Number(val) === 0) {
        return "-";
      }
      return formatAmount(val);
    },
  },

  {
    header: (
      <div style={{ lineHeight: "1.2", fontSize: "12px", whiteSpace: "normal" }}>
        Credit Amt
        <div style={{ fontSize: "11px", opacity: 0.85 }}>(SAR)</div>
      </div>
    ),
    accessor: "creditAmount",
    width: "125px",

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
    header: (
      <div style={{ lineHeight: "1.2", fontSize: "12px", whiteSpace: "normal" }}>
        After Applied
        <div style={{ fontSize: "11px", opacity: 0.85 }}>(SAR)</div>
      </div>
    ),
    accessor: "balance",
    width: "125px",

    render: (row) => {
      const invAmt = Number(row?.invoice_amount ?? row?.invoice_value ?? 0);
      const crAmt = Number(row?.credit_amount ?? 0);
      const appliedAmt = Number(row?.applied_amount ?? 0);

      if (invAmt > 0) {
        const deduction = appliedAmt > 0 ? appliedAmt : crAmt;
        const afterApplied = Math.max(0, invAmt - deduction);
        return formatAmount(afterApplied);
      }

      const bal = row?.balance ?? row?.remaining_balance;
      if (bal !== null && bal !== undefined && bal !== "") {
        return formatAmount(bal);
      }

      return formatAmount(0);
    },
  },

  {
    header: "Status",
    accessor: "status",
    width: "95px",

    render: (row) => {
      const raw = String(row?.status || "").toLowerCase();
      const text = formatStatus(raw);
      const color =
        raw === "closed" || raw === "applied"
          ? "#22a06b"
          : raw === "open" || raw === "pending" || raw === "partially_applied"
          ? "#f59e0b"
          : "#6b7280";
      return <span style={{ color, fontWeight: 500 }}>{text}</span>;
    },
  },

  {
    header: "Action",
    accessor: "actions",
    width: "145px",
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
