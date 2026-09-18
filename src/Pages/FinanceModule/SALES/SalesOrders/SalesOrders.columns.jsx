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

// Real backend order_status values: pending | confirmed | rejected | processing
export const ORDER_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "rejected", label: "Rejected" },
];

// Real backend payment_terms values
export const PAYMENT_TERMS_OPTIONS = [
    { value: "due_on_receipt", label: "Due on Receipt" },
    { value: "net_7", label: "Net 7" },
    { value: "net_15", label: "Net 15" },
    { value: "net_30", label: "Net 30" },
    { value: "net_45", label: "Net 45" },
    { value: "net_60", label: "Net 60" },
];

// Real backend delivery_status values (separate from order_status)
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

export const formatCurrency = (value) => {
    const amount = Number(value);
    if (Number.isNaN(amount)) return value ?? "-";
    return amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

// Columns are a factory so the page can wire a real delete handler
// (dispatching removeSalesOrder) instead of a hardcoded console.log.
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
        header: "Order Date",
        accessor: "order_date",
    },
    {
        header: "Delivery Date",
        accessor: "delivery_date",
    },
    {
        header: "Amount",
        accessor: "order_value",
        render: (row) => formatCurrency(row.order_value),
    },
    {
        header: "Order Status",
        accessor: "order_status",
        render: (row) => formatStatusLabel(row.order_status),
    },
    {
        header: "Delivery Status",
        accessor: "delivery_status",
        render: (row) => formatStatusLabel(row.delivery_status),
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

// Builds StatsCards entries directly from the /summary/ KPI payload.
// Pass whatever the backend returns for /finance/sales-order/summary/ —
// unmatched fields simply render as 0 until field names are confirmed
// against the live response.
export const buildSalesOrderStats = (kpi = {}) => [
    {
        title: "Total Sales Orders",
        count: kpi.total_sales_order ?? 0,
        icon: <FiShoppingCart />,
        backgroundColor: "#E8F1FF",
        iconColor: "#3478F6",
    },
    {
        title: "Total Order Value",
        count: kpi.total_order_value ?? 0,
        icon: <FiDollarSign />,
        backgroundColor: "#FFF4E5",
        iconColor: "#F59E0B",
    },
    {
        title: "Pending Orders",
        count: kpi.pending_order ?? 0,
        icon: <FiClock />,
        backgroundColor: "#FFF4E5",
        iconColor: "#F59E0B",
    },
    {
        title: "Partially Delivered",
        count: kpi.partially_delivered ?? 0,
        icon: <FiLoader />,
        backgroundColor: "#E8F1FF",
        iconColor: "#3478F6",
    },
    {
        title: "Completed Orders",
        count: kpi.completed_order ?? 0,
        icon: <FiCheckCircle />,
        backgroundColor: "#E8F8EF",
        iconColor: "#22A06B",
    },
];