import React from "react";
import {
  FiDollarSign,
  FiCreditCard,
  FiAlertCircle,
  FiTrendingUp,
  FiActivity,
} from "react-icons/fi";

export const formatSAR = (value) =>
  `SAR ${Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
export const formatCompactSAR = (value) => {
  const amount = Number(value || 0);
  if (Math.abs(amount) >= 1_000_000)
    return `SAR ${(amount / 1_000_000).toFixed(1)}M`;
  if (Math.abs(amount) >= 1_000) return `SAR ${(amount / 1_000).toFixed(1)}K`;
  return formatSAR(amount);
};
export const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

// Normalizes common backend naming conventions. Update these aliases if your API uses other field names.
export const normalizePayment = (row = {}, index = 0) => {
  const amount = Number(
    row.amount ?? row.payment_amount ?? row.total_amount ?? row.value ?? 0,
  );
  const rawStatus = row.status ?? row.payment_status ?? "Unknown";
  const rawType =
    row.type ?? row.payment_type ?? row.transaction_type ?? "Payment";
  return {
    id: row.id ?? row.pk ?? row.payment_id ?? `payment-${index}`,
    paymentId: String(
      row.payment_id ??
        row.paymentId ??
        row.reference_number ??
        row.code ??
        row.id ??
        `PAY-${index + 1}`,
    ),
    date: String(
      row.date ?? row.payment_date ?? row.created_at ?? row.created ?? "",
    ).slice(0, 10),
    type: String(rawType),
    customer:
      row.customer_name ??
      row.vendor_name ??
      row.party_name ??
      row.customer ??
      row.vendor ??
      row.party?.name ??
      "—",
    reference: String(
      row.reference ??
        row.reference_number ??
        row.invoice_number ??
        row.bill_number ??
        row.invoice?.number ??
        "—",
    ),
    method: String(row.method ?? row.payment_method ?? row.mode ?? "—"),
    amount,
    status: String(rawStatus),
    bank: String(
      row.bank_name ??
        row.bank_account_name ??
        row.bank_account ??
        row.bank ??
        "—",
    ),
  };
};

export const extractPaymentRows = (payload) => {
  if (Array.isArray(payload)) return payload;
  const candidates = [
    payload?.results,
    payload?.data,
    payload?.payments,
    payload?.records,
    payload?.items,
    payload?.data?.results,
    payload?.data?.payments,
  ];
  return candidates.find(Array.isArray) || [];
};

export const paymentTypeOptions = ["Customer Receipt", "Vendor Payment"];
export const paymentMethodOptions = [
  "Bank Transfer",
  "Credit Card",
  "Cheque",
  "Cash",
];
export const paymentStatusOptions = [
  "Completed",
  "Pending",
  "Failed",
  "Cancelled",
  "Processing",
];

export const buildPaymentKpis = (rows, apiSummary) => {
  if (apiSummary && typeof apiSummary === "object") {
    const totalCount =
      apiSummary.total_payments ?? apiSummary.total_count ?? rows.length;
    const totalValue =
      apiSummary.total_payment_value ??
      apiSummary.total_amount ??
      rows.reduce((s, r) => s + r.amount, 0);
    const received =
      apiSummary.amount_received ??
      rows
        .filter((r) => /receipt|received/i.test(r.type))
        .reduce((s, r) => s + r.amount, 0);
    const paid =
      apiSummary.amount_paid ??
      rows
        .filter((r) => /vendor|payment|paid/i.test(r.type))
        .reduce((s, r) => s + r.amount, 0);
    const pending =
      apiSummary.pending_amount ??
      rows
        .filter((r) => /pending/i.test(r.status))
        .reduce((s, r) => s + r.amount, 0);
    return [
      {
        title: "Total Payments",
        value: Number(totalCount).toLocaleString("en-US"),
        icon: <FiDollarSign />,
        background: "#e8efff",
        color: "#3154b5",
      },
      {
        title: "Total Payment Value",
        value: formatCompactSAR(totalValue),
        icon: <FiActivity />,
        background: "#fff2e6",
        color: "#ff850c",
      },
      {
        title: "Amount Received",
        value: formatCompactSAR(received),
        icon: <FiCreditCard />,
        background: "#dff4f7",
        color: "#19a8c2",
      },
      {
        title: "Amount Paid",
        value: formatCompactSAR(paid),
        icon: <FiAlertCircle />,
        background: "#f3dede",
        color: "#ed3434",
      },
      {
        title: "Pending Payments",
        value: formatCompactSAR(pending),
        icon: <FiTrendingUp />,
        background: "#eee5ff",
        color: "#8647ff",
      },
    ];
  }
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const received = rows
    .filter((r) => /customer receipt|received/i.test(r.type))
    .reduce((sum, r) => sum + r.amount, 0);
  const paid = rows
    .filter((r) => /vendor payment|paid/i.test(r.type))
    .reduce((sum, r) => sum + r.amount, 0);
  const pending = rows
    .filter((r) => /pending/i.test(r.status))
    .reduce((sum, r) => sum + r.amount, 0);
  return [
    {
      title: "Total Payments",
      value: rows.length.toLocaleString("en-US"),
      icon: <FiDollarSign />,
      background: "#e8efff",
      color: "#3154b5",
    },
    {
      title: "Total Payment Value",
      value: formatCompactSAR(total),
      icon: <FiActivity />,
      background: "#fff2e6",
      color: "#ff850c",
    },
    {
      title: "Amount Received",
      value: formatCompactSAR(received),
      icon: <FiCreditCard />,
      background: "#dff4f7",
      color: "#19a8c2",
    },
    {
      title: "Amount Paid",
      value: formatCompactSAR(paid),
      icon: <FiAlertCircle />,
      background: "#f3dede",
      color: "#ed3434",
    },
    {
      title: "Pending Payments",
      value: formatCompactSAR(pending),
      icon: <FiTrendingUp />,
      background: "#eee5ff",
      color: "#8647ff",
    },
  ];
};
