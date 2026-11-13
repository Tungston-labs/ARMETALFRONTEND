import React from "react";

export const formatMoney = (value) => {
  const amount = Number(value ?? 0);
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

export const buildEquityStatsCards = (summary = {}) => [
  {
    title: "Total Equity",
    count: `SAR ${formatMoney(summary.total_equity)}`,
    icon: "▦",
    backgroundColor: "#E8F7EC",
    iconColor: "#138A35",
  },
  {
    title: "Net Profit",
    count: `SAR ${formatMoney(summary.net_profit)}`,
    icon: "▤",
    backgroundColor: "#F3E8FF",
    iconColor: "#8B5CF6",
  },
  {
    title: "Share Capital",
    count: `SAR ${formatMoney(summary.share_capital)}`,
    icon: "▦",
    backgroundColor: "#FDE8E8",
    iconColor: "#EF4444",
  },
  {
    title: "Retained Earnings",
    count: `SAR ${formatMoney(summary.retained_earnings)}`,
    icon: "◇",
    backgroundColor: "#E8F7EC",
    iconColor: "#16A34A",
  },
  {
    title: "Dividends Declared",
    count: `SAR ${formatMoney(summary.dividends_declared)}`,
    icon: "▤",
    backgroundColor: "#FFF1DF",
    iconColor: "#F97316",
  },
];

const negativeAware = (accessor) => (row) => {
  const value = Number(row[accessor] ?? 0);
  if (value === 0) return "–";
  const formatted = formatMoney(Math.abs(value));
  return value < 0 ? (
    <span style={{ color: "#DC2626" }}>({formatted})</span>
  ) : (
    formatted
  );
};

export const equityColumns = [
  { accessor: "particulars", header: "Particulars (SAR)" },
  {
    accessor: "share_capital",
    header: "Share Capital",
    render: negativeAware("share_capital"),
  },
  {
    accessor: "retained_earnings",
    header: "Retained Earnings",
    render: negativeAware("retained_earnings"),
  },
  {
    accessor: "reserves",
    header: "Reserves",
    render: negativeAware("reserves"),
  },
  {
    accessor: "other_equity",
    header: "Other Equity",
    render: negativeAware("other_equity"),
  },
  {
    accessor: "total_equity",
    header: "Total Equity",
    render: negativeAware("total_equity"),
  },
];

export const COMPONENT_TABS = [
  { label: "Share Capital", value: "share_capital" },
  { label: "Retained Earning", value: "retained_earnings" },
  { label: "Reserves", value: "reserves" },
  { label: "Other Equity", value: "other_equity" },
];

export const equityRowsForComponent = (rows, selected) => {
  if (selected === "all") return rows;
  // Keep the particulars and selected component, plus total equity, so the
  // filtered report remains meaningful and compatible with ReusableTable.
  return rows.map((row) => ({
    particulars: row.particulars,
    share_capital: selected === "share_capital" ? row.share_capital : "–",
    retained_earnings:
      selected === "retained_earnings" ? row.retained_earnings : "–",
    reserves: selected === "reserves" ? row.reserves : "–",
    other_equity: selected === "other_equity" ? row.other_equity : "–",
    total_equity: row.total_equity,
  }));
};
