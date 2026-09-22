import React from "react";
import {
    FiShoppingCart,
    FiDollarSign,
    FiCheckCircle,
    FiClock,
    FiXCircle,
} from "react-icons/fi";

import InvoiceActions from "./action/InvoiceActions";

export const getInvoiceStatusMeta = (row) => {
    const rawStatus =
        row.payment_status ||
        row.status ||
        "";

    const status = String(rawStatus)
        .trim()
        .toLowerCase();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = row.due_date
        ? new Date(row.due_date)
        : null;

    if (due) {
        due.setHours(0, 0, 0, 0);
    }

    const isOverdue =
        status !== "paid" &&
        due &&
        due.getTime() < today.getTime();

    if (isOverdue) {
        return {
            label: "Overdue",
            key: "overdue",
        };
    }

    switch (status) {
        case "paid":
            return {
                label: "Paid",
                key: "paid",
            };

        case "partially_paid":
        case "partial_paid":
        case "partially paid":
            return {
                label: "Partially Paid",
                key: "partially_paid",
            };

        case "pending":
        case "unpaid":
        default:
            return {
                label: "Pending",
                key: "pending",
            };
    }
};

export const getSalesInvoiceColumns = (onDelete) => [
    {
        header: "Invoice No",
        accessor: "invoice_number",
    },

    {
        header: "SO Ref",
        accessor: "sales_order_number",
    },

    {
        header: "Customer",
        accessor: "customer_display_name",
        render: (row) =>
            row.customer_display_name ||
            row.customer_name ||
            "—",
    },

    {
        header: "Invoice Date",
        accessor: "invoice_date",
    },

    {
        header: "Due Date",
        accessor: "due_date",
    },

    {
        header: "Amount",
        accessor: "total_amount",
        render: (row) =>
            row.total_amount ?? "0.00",
    },

    {
        header: "Paid",
        accessor: "amount_paid",
        render: (row) =>
            row.amount_paid ?? "0.00",
    },

    {
        header: "Payment Status",
        accessor: "payment_status",
        render: (row) => {
            const {
                label,
                key,
            } = getInvoiceStatusMeta(row);

            return (
                <StatusBadge status={key}>
                    {label}
                </StatusBadge>
            );
        },
    },

    {
        header: "Action",
        accessor: "actions",
        sortable: false,
        render: (row) => (
            <InvoiceActions
                row={row}
                onDelete={onDelete}
            />
        ),
    },
];

const STATUS_COLORS = {
    paid: {
        bg: "#E8F8EF",
        color: "#22A06B",
    },

    partially_paid: {
        bg: "#FFF4E5",
        color: "#F59E0B",
    },

    pending: {
        bg: "#FFF4E5",
        color: "#F59E0B",
    },

    unpaid: {
        bg: "#FFF4E5",
        color: "#F59E0B",
    },

    overdue: {
        bg: "#FDECEC",
        color: "#E5484D",
    },
};

const StatusBadge = ({
    status,
    children,
}) => {
    const palette =
        STATUS_COLORS[status] ||
        STATUS_COLORS.unpaid;

    return (
        <span
            style={{
                display: "inline-block",
                padding: "2px 10px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
                background: palette.bg,
                color: palette.color,
            }}
        >
            {children}
        </span>
    );
};

export const salesInvoiceStats = (
    stats = {}
) => [
    {
        title: "Total Invoices",
        count:
            stats.total_invoice_count ?? 0,
        icon: <FiShoppingCart />,
        backgroundColor: "#E8F1FF",
        iconColor: "#3478F6",
    },

    {
        title: "Total Invoice Value",
        count:
            stats.total_invoice_value ?? 0,
        icon: <FiDollarSign />,
        backgroundColor: "#FFF4E5",
        iconColor: "#F59E0B",
    },

    {
        title: "Payment Received",
        count:
            stats.payment_received ?? 0,
        icon: <FiCheckCircle />,
        backgroundColor: "#E8F8EF",
        iconColor: "#22A06B",
    },

    {
        title: "Outstanding Amount",
        count:
            stats.outstanding_amount ?? 0,
        icon: <FiClock />,
        backgroundColor: "#FFF4E5",
        iconColor: "#F59E0B",
    },

    {
        title: "Average Invoice Value",
        count:
            stats.average_invoice_value ?? 0,
        icon: <FiXCircle />,
        backgroundColor: "#FDECEC",
        iconColor: "#E5484D",
    },
];