import React from "react";
import {
    FiUsers,
    FiUserCheck,
    FiUserX,
    FiDollarSign,
} from "react-icons/fi";
import VendorActions from "./modal/Vendoractions";

const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

export const getVendorColumns = ({ onEdit, onDelete } = {}) => [
    { header: "Code", accessor: "vendor_id" },
{
        header: "Vendor Name",
        accessor: "name",
       
    },
    { header: "Vendor Group", accessor: "vendor_type_display" },
    { header: "Phone Number", accessor: "phno" },
    { header: "Payment Terms", accessor: "payment_term_display" },
    {
        header: "Credit Limit",
        accessor: "credit_limit",
        // render: (row) =>
        //     `${row.currency || ""} ${formatAmount(row.credit_limit)}`.trim(),
    },
    {
        header: "Current Balance",
        accessor: "opening_balance",
        // render: (row) =>
        //     `${row.currency || ""} ${formatAmount(row.opening_balance)}`.trim(),
    },
    {
        header: "Action",
        accessor: "actions",
        sortable: false,
        render: (row) => (
            <VendorActions row={row} onEdit={onEdit} onDelete={onDelete} />
        ),
    },
];

const pick = (obj, keys) => {
    for (const key of keys) {
        if (obj?.[key] !== undefined && obj?.[key] !== null) {
            return Number(obj[key]);
        }
    }
    return null;
};

export const vendorStats = (dashboard = {}, totalItems = 0) => {
    const d = dashboard || {};

    const total = pick(d, ["total_vendors", "total_count", "total"]) ?? totalItems;
    const active = pick(d, ["active_vendors", "active_count", "active"]) ?? 0;
    const inactive = pick(d, ["inactive_vendors", "inactive_count", "inactive"]) ?? 0;
    const payable =
        pick(d, ["total_payable", "total_outstanding", "total_opening_balance"]) ?? 0;

    return [
        {
            title: "Total Vendors",
            count: total,
            icon: <FiUsers size={22} />,
            backgroundColor: "#E8F0FE",
            iconColor: "#1A73E8",
        },
        {
            title: "Active Vendors",
            count: active,
            icon: <FiUserCheck size={22} />,
            backgroundColor: "#E6F4EA",
            iconColor: "#188038",
        },
        {
            title: "Inactive Vendors",
            count: inactive,
            icon: <FiUserX size={22} />,
            backgroundColor: "#FDEEEE",
            iconColor: "#B00020",
        },
        {
            title: "Total Payable",
            count: formatAmount(payable),
            icon: <FiDollarSign size={22} />,
            backgroundColor: "#FEF7E0",
            iconColor: "#B06000",
        },
    ];
};