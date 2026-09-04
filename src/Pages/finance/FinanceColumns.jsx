import React from "react";
import { FaRegMessage } from "react-icons/fa6";
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from "react-icons/fi";
import { formatCurrency } from "../../utils/FormatCurrency"; 

const FALLBACK = "----";

const formatDate = (date) => {
  if (!date) return FALLBACK;

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Returns the column config for the Finance table.
 * @param {number} page          current page (for Sl No numbering)
 * @param {number} pageSize      rows per page (for Sl No numbering)
 * @param {string} currencyCode  company's active currency, e.g. "INR", "AED"
 */
export const getFinanceColumns = ({ page, pageSize, currencyCode }) => [
  {
    header: "Sl No",
    accessor: "slNo",
    sortable: false,
    render: (row, index) => (page - 1) * pageSize + index + 1,
  },
  {
    header: "Date",
    accessor: "date",
    render: (row) => formatDate(row.date),
  },
  {
    header: "Category",
    accessor: "category_name",
    render: (row) => row.category_name || FALLBACK,
  },
{
  header: "Note",
  accessor: "note",
  render: (row) => {
    const note = row.note || FALLBACK;

    return (
      <span
        title={note}
        style={{
          display: "inline-block",
          // maxWidth: "180px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          cursor: "default",
        }}
      >
        {note}
      </span>
    );
  },
},
  {
    header: "Income",
    accessor: "income",
    sortable: false,
    render: (row) =>
      row.payment_type === "IN"
        ? row.amount != null
          ? formatCurrency(row.amount, currencyCode)
          : FALLBACK
        : "--",
  },
  {
    header: "Expense",
    accessor: "expense",
    sortable: false,
    render: (row) =>
      row.payment_type === "OUT"
        ? row.amount != null
          ? formatCurrency(row.amount, currencyCode)
          : FALLBACK
        : "--",
  },
  {
    header: "Status",
    accessor: "payment_type",
    sortable: false,
    render: (row) => (
      <span
        style={{
          padding: "4px 10px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 600,
          color: row.payment_type === "IN" ? "#16a34a" : "#dc2626",
          backgroundColor:
            row.payment_type === "IN" ? "#d3f3e0" : "#fbdcdc",
        }}
      >
        {row.payment_type === "IN" ? "Income" : "Expense"}
      </span>
    ),
  },
];

/**
 * Returns the stat cards config for the Finance summary.
 * These depend on live totals from Redux state, so this is a function
 * (not a static array) — the caller passes in the current values.
 * @param {number} totalIncome
 * @param {number} totalExpense
 * @param {number} cashBalance
 * @param {string} currencyCode  company's active currency
 */
export const getStatCards = ({ totalIncome, totalExpense, cashBalance, currencyCode }) => [
  //    {
  //   icon: <FaRegMessage size={20} />,
  //    iconColor: "#157baa",
  //   backgroundColor: "#e3f5f7",
  //   count: `${formatCurrency(totalIncome, currencyCode)}`,
  //   title: "Total Records",
  // },
  {
    icon: <FiTrendingUp size={20} />,
    backgroundColor: "#d3f3e0",
    iconColor: "#22c55e",
    count: `${formatCurrency(totalIncome, currencyCode)}`,
    title: "Total Income",
  },
  {
    icon: <FiTrendingDown size={20} />,
    backgroundColor: "#fbdcdc",
    iconColor: "#ef4444",
    count: `${formatCurrency(totalExpense, currencyCode)}`,
    title: "Total Expense",
  },
  {
    icon: <FiDollarSign size={20} />,
    backgroundColor: "#e0e7ff",
    iconColor: "#6366f1",
    count: `${formatCurrency(cashBalance, currencyCode)}`,
    title: "Cash Balance",
  },
];