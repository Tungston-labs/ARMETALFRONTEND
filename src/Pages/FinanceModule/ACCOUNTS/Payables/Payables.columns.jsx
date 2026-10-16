import React from "react";

import { TbFileInvoice, TbArrowUp, TbArrowDown } from "react-icons/tb";
import { MdOutlineInventory2, MdOutlineAccountBalance } from "react-icons/md";

// ==========================================
// TABLE COLUMNS
// ==========================================
// Match this shape to your existing employeeColumns format
// (for example, add `render` or `width` if your ReusableTable supports them).
export const payableColumns = [
    { key: "bill_number", label: "Bill No" },
    { key: "vendor_name", label: "Vendor" },
    { key: "bill_date", label: "Bill Date" },
    { key: "due_date", label: "Due Date" },
    { key: "total_amount", label: "Amount" },
    { key: "balance", label: "Balance" },
    { key: "status", label: "Status" },
];

// ==========================================
// STATS CARDS
// ==========================================
export const formatAmount = (v) =>
    Number(v || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

// Builds the cards for <StatsCards /> from the API `dashboard` object
export const buildStatsCards = (dashboard) => [
    {
        count: formatAmount(dashboard?.total_payable),
        title: "Total payable",
        icon: <TbFileInvoice />,
        backgroundColor: "#E7F8EC",
        iconColor: "#00A63C",
    },
    {
        count: formatAmount(dashboard?.not_yet_due),
        title: "Not yet Due",
        icon: <MdOutlineInventory2 />,
        backgroundColor: "#F1E8FF",
        iconColor: "#923CFF",
    },
    {
        count: formatAmount(dashboard?.overdue_to_vendors),
        title: "Overdue to vendors",
        icon: <MdOutlineAccountBalance />,
        backgroundColor: "#E7F8EC",
        iconColor: "#00A63C",
    },
    {
        count: formatAmount(dashboard?.due_in_next_14_days),
        title: "Due in next 14 days",
        icon: <TbArrowUp />,
        backgroundColor: "#FFF1E5",
        iconColor: "#FF7200",
    },
    {
        count: String(dashboard?.vendors_overdue_count ?? 0),
        title: "Vendors overdue",
        icon: <TbArrowDown />,
        backgroundColor: "#FFE8E8",
        iconColor: "#FF3131",
    },
];