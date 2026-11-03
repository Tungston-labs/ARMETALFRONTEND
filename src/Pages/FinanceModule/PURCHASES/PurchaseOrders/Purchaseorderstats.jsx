import React from "react";
import {
    FiFileText,
    FiDollarSign,
    FiClock,
    FiTruck,
    FiCheckCircle,
} from "react-icons/fi";
import PurchaseOrderActions from "./action/Purchaseorderactions";

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

export const STATUS_META = {
    draft: { label: "Draft", bg: "#E8EDFB", color: "#3250B5" },           // blue
    sent_to_vendor: { label: "Sent to Vendor", bg: "#FFF4E5", color: "#F48211" }, // yellow/orange
    pending: { label: "Pending", bg: "#FFF7ED", color: "#B06000" },
    approved: { label: "Approved", bg: "#E0F2F1", color: "#00796B" },
    ordered: { label: "Ordered", bg: "#EEF2FF", color: "#4F46E5" },
    partially_received: { label: "Partially Received", bg: "#FEF7E0", color: "#B06000" },
    received: { label: "Received", bg: "#E6F4EA", color: "#018611" },       // green
    cancelled: { label: "Cancelled", bg: "#FDEEEE", color: "#D32F2F" },    // red
};

const StatusBadge = ({ status }) => {
    const meta = STATUS_META[status] || {
        label: humanize(status),
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
        render: (row) => formatAmount(row.total_amount),
    },
    {
        header: "Warehouse",
        accessor: "warehouse_name",
        render: (row) => row.warehouse_name || "-",
    },
    {
        header: "Order Status",
        accessor: "status",
        render: (row) => <StatusBadge status={row.status} />,
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

const pick = (obj, keys) => {
    for (const key of keys) {
        if (obj?.[key] !== undefined && obj?.[key] !== null) {
            return Number(obj[key]);
        }
    }
    return null;
};

export const purchaseOrderStats = (dashboard = {}, totalItems = 0) => {
    const d = dashboard || {};

    const total =
        pick(d, ["total_purchase_orders", "total_orders", "total_count", "total"]) ??
        totalItems;
    const value =
        pick(d, ["total_purchase_value", "total_value", "total_amount"]) ?? 0;
    const received =
        pick(d, [
            "fully_received",
            "fully_received_orders",
            "fully_received_count",
            "received_orders",
            "received_count",
            "received",
        ]) ?? 0;
    const awaiting =
        pick(d, [
            "awaiting_delivery",
            "awaiting_delivery_count",
            "pending_orders",
            "pending_count",
            "pending",
        ]) ?? 0;
    const partial =
        pick(d, [
            "partially_received",
            "partially_received_orders",
            "partially_received_count",
        ]) ?? 0;

    return [
        {
            title: "Total Purchase Orders",
            count: total,
            icon: <FiFileText size={22} />,
            backgroundColor: "#EEF2FF",
            iconColor: "#4F46E5",
        },
        {
            title: "Total Purchase Value",
            count: formatAmount(value),
            icon: <FiDollarSign size={22} />,
            backgroundColor: "#fdfbec",
            iconColor: "#b96a10",
        },
        {
            title: "Fully Received",
            count: received,
            icon: <FiCheckCircle size={22} />,
            backgroundColor: "#ECFDF5",
            iconColor: "#10B981",
        },
        {
            title: "Awaiting Delivery",
            count: awaiting,
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