import React from "react";
import {
    FiShoppingCart,
    FiDollarSign,
    FiCheckCircle,
    FiClock,
    FiXCircle,
    FiLoader,
} from "react-icons/fi";

import OrderActions from "./action/OrderAction";
import { formatDate } from "../../../../utils/Formatdate";

export const ORDER_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
];

export const PAYMENT_TERMS_OPTIONS = [
    { value: "due_on_receipt", label: "Due on Receipt" },
    { value: "net_7", label: "Net 7" },
    { value: "net_15", label: "Net 15" },
    { value: "net_30", label: "Net 30" },
    { value: "net_45", label: "Net 45" },
    { value: "net_60", label: "Net 60" },
];

export const DELIVERY_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "partially_delivered", label: "Partially Delivered" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
];

export const formatStatusLabel = (value = "") =>
    value
        .split("_")
        .filter(Boolean)
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");

        const STATUS_COLORS = {
    // order status
    draft:               { bg: "#F3F4F6", color: "#6B7280" },
    pending:             { bg: "#FFF4E5", color: "#F59E0B" },
    confirmed:           { bg: "#E8F1FF", color: "#3478F6" },
    processing:          { bg: "#F1E8FF", color: "#8B5CF6" },

    // delivery status
    partially_delivered: { bg: "#E0F7FA", color: "#0891B2" },
    completed:           { bg: "#E8F8EF", color: "#22A06B" },
    cancelled:           { bg: "#FFE8E8", color: "#EF4444" },

    // invoice status
    partially_invoiced:  { bg: "#E0F7FA", color: "#0891B2" },
    invoiced:            { bg: "#E8F8EF", color: "#22A06B" },
    overdue:             { bg: "#FFE8E8", color: "#EF4444" },
};

const DEFAULT_STATUS_COLOR = { bg: "#F3F4F6", color: "#6B7280" };

export const StatusBadge = ({ value }) => {
    if (!value) return "-";

    const { bg, color } = STATUS_COLORS[value] || DEFAULT_STATUS_COLOR;

    return (
        <span
            style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "999px",
                backgroundColor: bg,
                color,
                fontSize: "12px",
                fontWeight: 600,
                whiteSpace: "nowrap",
            }}
        >
            {formatStatusLabel(value)}
        </span>
    );
};
export const formatCurrency = (value) => {
    const amount = Number(value);
    if (Number.isNaN(amount)) return value ?? "-";
    return amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

export const getSalesOrderColumns = ({ onDelete }) => [
    {
        header: "SO Number",
        accessor: "so_number",
    },
    {
        header: "Customer",
        accessor: "customer_name",
    },
    {
        header: "Quote Ref",
        accessor: "quote_reference",
    },
    {
    header: "Order Date",
    accessor: "order_date",
    render: (row) => formatDate(row.order_date),
},
{
    header: "Delivery Date",
    accessor: "delivery_date",
    render: (row) => formatDate(row.delivery_date),
},

   
    {
        header: "Order Value",
        accessor: "order_value",
        render: (row) => formatCurrency(row.order_value),
    },
    {
        header: "Order Status",
        accessor: "order_status",
        render: (row) => <StatusBadge value={row.order_status} />,
    },
    {
        header: "Delivery Status",
        accessor: "delivery_status",
        render: (row) => <StatusBadge value={row.delivery_status} />,
    },
    {
        header: "Invoice Status",
        accessor: "invoice_status",
        render: (row) => <StatusBadge value={row.invoice_status} />,
    },
    {
        header: "Action",
        accessor: "actions",
        sortable: false,
        render: (row) => (
            <OrderActions row={row} onDelete={() => onDelete(row)} />
        ),
    },
];


export const buildSalesOrderStats = (kpi = {}) => [
    {
        title: "Total Orders",
        count: kpi.total_sales_order ?? 0,
        icon: <FiShoppingCart />,
        backgroundColor: "#E8F1FF",
        iconColor: "#3478F6",
    },
    {
        title: "Order Value",
        count: kpi.total_order_value ?? 0,
        icon: <FiDollarSign />,
        backgroundColor: "#FFF4E5",
        iconColor: "#F59E0B",
    },
    {
        title: "Open Orders",
        count: kpi.pending_order ?? 0,
        icon: <FiClock />,
        backgroundColor: "#FFF4E5",
        iconColor: "#F59E0B",
    },
    {
        title: "Rejected Orders",
        count: kpi.partially_delivered ?? 0,
        icon: <FiLoader />,
        backgroundColor: "#ffe8e8",
        iconColor: "#f63434f2",
    },
    {
        title: "Completed Orders",
        count: kpi.completed_order ?? 0,
        icon: <FiCheckCircle />,
        backgroundColor: "#E8F8EF",
        iconColor: "#22A06B",
    },
];