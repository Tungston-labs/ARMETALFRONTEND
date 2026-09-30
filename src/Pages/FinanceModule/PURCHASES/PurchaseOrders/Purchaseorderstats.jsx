import React from "react";
import {
    FiFileText,
    FiDollarSign,
    FiClock,
    FiTruck,
    FiEdit2,
    FiTrash2,
} from "react-icons/fi";
import PurchaseOrderActions from "./action/Purchaseorderactions";

// ===============================
// Helpers
// ===============================

const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    return Number.isNaN(d.getTime())
        ? value
        : d.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          });
};
const humanize = (value) =>
    value
        ? String(value).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "-";
// key -> label + badge colours
export const STATUS_META = {
    draft: { label: "Draft", bg: "#F3F4F6", color: "#4B5563" },
    pending: { label: "Pending", bg: "#FFF7ED", color: "#B06000" },
    approved: { label: "Approved", bg: "#E8F0FE", color: "#1A73E8" },
    partially_received: { label: "Partially Received", bg: "#FEF7E0", color: "#B06000" },
    received: { label: "Received", bg: "#E6F4EA", color: "#188038" },
    cancelled: { label: "Cancelled", bg: "#FDEEEE", color: "#B00020" },
};

const StatusBadge = ({ status }) => {
    const meta = STATUS_META[status] || {
        label: status || "-",
        bg: "#F3F4F6",
        color: "#4B5563",
    };

    return (
        <span
            style={{
                display: "inline-block",
                padding: "3px 10px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 500,
                background: meta.bg,
                color: meta.color,
                whiteSpace: "nowrap",
            }}
        >
            {meta.label}
        </span>
    );
};



// ===============================
// Table columns
// ===============================
// A function because the action buttons need handlers from the hook.
// Usage: getPurchaseOrderColumns({ onEdit, onDelete })

export const getPurchaseOrderColumns = ({ onDelete } = {}) => [
    { header: "PO Number", accessor: "po_number" },
    { header: "Vendor", accessor: "vendor_name" },
    {
        header: "Order Date",
        accessor: "order_date",
        render: (row) => formatDate(row.order_date),
    },
    {
        header: "Delivery Date",
        accessor: "expected_delivery_date",
        render: (row) => formatDate(row.expected_delivery_date),
    },
    {
        header: "Order Value",
        accessor: "total_amount",
        render: (row) =>
            `${row.currency || ""} ${formatAmount(row.total_amount)}`.trim(),
    },
    {
        header: "Order Status",
        accessor: "order_status",
        render: (row) => <StatusBadge status={row.order_status} />,
    },
    {
        header: "Receipt Status",
        accessor: "receipt_status",
        render: (row) => humanize(row.receipt_status),
    },
    {
        header: "Bill Status",
        accessor: "bill_status",
        render: (row) => humanize(row.bill_status),
    },
    {
        header: "Created By",
        accessor: "created_by_name",
        render: (row) => row.created_by_name || "-",
    },
    {
        header: "Action",
        accessor: "actions",
        sortable: false,
        render: (row) => (
            <PurchaseOrderActions row={row} onDelete={onDelete} />
        ),
    },
];

// ===============================
// Stat cards
// ===============================
// Computed from the rows for now. When the API has a dashboard endpoint,
// swap this to read from it like vendorStats does.

export const purchaseOrderStats = (orders = []) => {
    const active = orders.filter((o) => o.order_status !== "cancelled");
    const totalValue = active.reduce(
        (sum, o) => sum + Number(o.total_amount || 0),
        0
    );
    const pending = orders.filter((o) => o.order_status === "pending").length;
    const partial = orders.filter(
        (o) => o.order_status === "partially_received"
    ).length;

    return [
        {
            title: "Total Purchase Orders",
            count: orders.length,
            icon: <FiFileText size={22} />,
            backgroundColor: "#EEF2FF",
            iconColor: "#4F46E5",
        },
        {
            title: "Total Purchase Value",
            count: formatAmount(totalValue),
            icon: <FiDollarSign size={22} />,
            backgroundColor: "#ECFDF5",
            iconColor: "#10B981",
        },
        {
            title: "Pending Orders",
            count: pending,
            icon: <FiClock size={22} />,
            backgroundColor: "#FFF7ED",
            iconColor: "#F59E0B",
        },
        {
            title: "Partially Received",
            count: partial,
            icon: <FiTruck size={22} />,
            backgroundColor: "#FEF2F2",
            iconColor: "#EF4444",
        },
    ];
};