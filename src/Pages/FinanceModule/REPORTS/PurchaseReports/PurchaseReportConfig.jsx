import React from "react";
import {
  FiDollarSign,
  FiFileText,
  FiCreditCard,
  FiAlertCircle,
  FiTrendingUp,
} from "react-icons/fi";

const formatNumber = (value) =>
  Number(value ?? 0).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });

export const formatSAR = (value) => `SAR ${formatNumber(value)}`;

export const buildPurchaseStatsCards = (summary = {}) => [
  {
    title: "Total Purchases",
    count: formatSAR(summary.totalPurchases),
    icon: <FiDollarSign />,
    backgroundColor: "#E8EFFF",
    iconColor: "#3154B5",
  },
  {
    title: "Total PO",
    count: formatNumber(summary.totalPO),
    icon: <FiFileText />,
    backgroundColor: "#DFF4F7",
    iconColor: "#19A8C2",
  },
  {
    title: "Payments Made",
    count: formatSAR(summary.paymentsMade),
    icon: <FiCreditCard />,
    backgroundColor: "#FFF2E6",
    iconColor: "#FF850C",
  },
  {
    title: "Purchase Returns",
    count: formatSAR(summary.purchaseReturns),
    icon: <FiAlertCircle />,
    backgroundColor: "#F3DEDE",
    iconColor: "#ED3434",
  },
  {
    title: "Outstanding Payables",
    count: formatSAR(summary.outstandingPayables),
    icon: <FiTrendingUp />,
    backgroundColor: "#EEE5FF",
    iconColor: "#8647FF",
  },
];

const STATUS_COLORS = {
  paid: { bg: "#E5F5EC", color: "#239653" },
  delivered: { bg: "#E5F5EC", color: "#239653" },
  received: { bg: "#E5F5EC", color: "#239653" },
  completed: { bg: "#E5F5EC", color: "#239653" },
  partial: { bg: "#FFF1DF", color: "#F08A18" },
  partially: { bg: "#FFF1DF", color: "#F08A18" },
  "partially paid": { bg: "#FFF1DF", color: "#F08A18" },
  pending: { bg: "#FFF1DF", color: "#F08A18" },
  unpaid: { bg: "#FDE8E8", color: "#DC2626" },
  overdue: { bg: "#FDE8E8", color: "#DC2626" },
  cancelled: { bg: "#F3F4F6", color: "#6B7280" },
  rejected: { bg: "#FDE8E8", color: "#DC2626" },
};

const StatusBadge = ({ value }) => {
  const label = String(value ?? "—");
  const statusKey = label.trim().toLowerCase();

  const style = STATUS_COLORS[statusKey] ?? {
    bg: "#F1F1F1",
    color: "#555555",
  };

  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: style.bg,
        color: style.color,
        padding: "4px 10px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {label || "—"}
    </span>
  );
};

export const purchaseColumns = [
  {
    accessor: "po",
    header: "PO No.",
  },
  {
    accessor: "date",
    header: "PO Date",
  },
  {
    accessor: "vendor",
    header: "Vendor",
  },
  {
    accessor: "items",
    header: "Items",
  },
  {
    accessor: "value",
    header: "Purchase Value",
    render: (row) => formatSAR(row.value),
  },
  {
    accessor: "outstanding",
    header: "Outstanding Value",
    render: (row) => formatSAR(row.outstanding),
  },
  {
    accessor: "bill",
    header: "Bill Status",
    render: (row) => <StatusBadge value={row.bill} />,
  },
  {
    accessor: "payment",
    header: "Payment Status",
    render: (row) => <StatusBadge value={row.payment} />,
  },
];

export const purchaseStatusOptions = [
  { label: "All Purchase Statuses", value: "all" },
  { label: "Delivered", value: "delivered" },
  { label: "Pending", value: "pending" },
  { label: "Partially", value: "partial" },
];

export const billStatusOptions = [
  { label: "All Bill Statuses", value: "all" },
  { label: "Delivered", value: "delivered" },
  { label: "Pending", value: "pending" },
  { label: "Partially", value: "partially" },
];

export const paymentStatusOptions = [
  { label: "All Payment Statuses", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Partial", value: "partial" },
  { label: "Unpaid", value: "unpaid" },
];
