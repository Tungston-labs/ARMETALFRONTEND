import React from "react";
import {
    FiFileText,
    FiDollarSign,
    FiClock,
    FiTruck,
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

// "partially_received" -> "Partially Received"
const humanize = (value) =>
    value
        ? String(value).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "-";

// key -> label + text colour (plain coloured text, as in the design)
export const STATUS_META = {
    draft: { label: "Draft", color: "#3049A3" },
    sent_to_vendor: { label: "Sent to Vendor", color: "#F5820E" },
    received: { label: "Received", color: "#16A34A" },
    cancelled: { label: "Cancelled", color: "#DC2626" },

    // Older values, kept so existing records still display
    pending: { label: "Pending", color: "#F5820E" },
    approved: { label: "Approved", color: "#1A73E8" },
    ordered: { label: "Ordered", color: "#4F46E5" },
    partially_received: { label: "Partially Received", color: "#B06000" },
};

const StatusText = ({ status }) => {
    const meta = STATUS_META[status] || {
        label: humanize(status),
        color: "#4B5563",
    };

    return (
        <span
            style={{
                color: meta.color,
                fontSize: 13,
                fontWeight: 400,
                whiteSpace: "nowrap",
            }}
        >
            {meta.label}
        </span>
    );
};

// Warehouse and linked bill may come back as a string, a nested object or a flat field.
// The key names are guesses, so adjust them to match your list API.
const getWarehouseName = (row) =>
    row.warehouse_name ||
    row.warehouse?.name ||
    (typeof row.warehouse === "string" ? row.warehouse : "") ||
    "-";

const getLinkedBill = (row) =>
    row.linked_bill ||
    row.bill_number ||
    row.bill?.bill_number ||
    row.bill?.number ||
    "-";

// ===============================
// Table columns (match the API list fields)
// ===============================
// A function because the action buttons need the handlers from the hook.
// Usage: getPurchaseOrderColumns({ onDelete, onDownload })

export const getPurchaseOrderColumns = ({ onDelete, onDownload } = {}) => [
    { header: "PO Number", accessor: "po_number" },
    { header: "Vendor", accessor: "vendor_name" },
    {
        header: "Order Date",
        accessor: "order_date",
        render: (row) => formatDate(row.order_date),
    },
    {
        header: "Expected Delivery",
        accessor: "expected_delivery_date",
        render: (row) => formatDate(row.expected_delivery_date),
    },
    {
        header: "Warehouse",
        accessor: "warehouse_name",
        render: (row) => getWarehouseName(row),
    },
    {
        header: "Amount",
        accessor: "total_amount",
        render: (row) => formatAmount(row.total_amount),
    },
    {
        header: "Status",
        accessor: "status",
        render: (row) => <StatusText status={row.status} />,
    },
    {
        header: "Linked Bill",
        accessor: "linked_bill",
        sortable: false,
        render: (row) => getLinkedBill(row),
    },
    {
        header: "Action",
        accessor: "actions",
        sortable: false,
        render: (row) => (
            <PurchaseOrderActions
                row={row}
                onDelete={onDelete}
                onDownload={onDownload}
            />
        ),
    },
];

// ===============================
// Stat cards
// ===============================
// `dashboard` is the response of GET /finance/purchase-order/dashboard/.
// I haven't seen its shape, so each card tries a few likely key names.
// Once you send a sample response, replace the key lists with the real ones.

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
    const pending =
        pick(d, ["pending_orders", "pending_count", "pending"]) ?? 0;
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