import React from "react";
import {
    FiDollarSign,
    FiArrowUpCircle,
    FiArrowDownCircle,
    FiCheckCircle,
    FiFileText,
} from "react-icons/fi";

// Format amount without currency symbol
export const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const TRANSACTION_TYPE_COLORS = {
    opening_balance: {
        bg: "#EEF2FF",
        color: "#4F46E5",
    },

    invoice: {
        bg: "#FFF4E5",
        color: "#F59E0B",
    },

    payment: {
        bg: "#E8F8EF",
        color: "#22A06B",
    },

    credit_note: {
        bg: "#FDECEC",
        color: "#E5484D",
    },

    debit_note: {
        bg: "#F3EFEC",
        color: "#6B7280",
    },

    adjustment: {
        bg: "#E0F3F7",
        color: "#4455EF",
    },
};

const TransactionTypeBadge = ({ type, children }) => {
    const palette =
        TRANSACTION_TYPE_COLORS[type] ||
        TRANSACTION_TYPE_COLORS.adjustment;

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

export const getCustomerLedgerColumns = () => [
    {
        header: "Date",
        accessor: "transaction_date",
    },

    {
        header: "Type",
        accessor: "transaction_type_display",
        render: (row) => (
            <TransactionTypeBadge type={row.transaction_type}>
                {row.transaction_type_display}
            </TransactionTypeBadge>
        ),
    },

    {
        header: "Reference",
        accessor: "reference_number",
        render: (row) => row.reference_number || "—",
    },

    {
        header: "Customer",
        accessor: "customer_name",
    },

    {
        header: "Description",
        accessor: "description",
        sortable: false,
        render: (row) => row.description || "—",
    },

    {
        header: "Debit",
        accessor: "debit",
        render: (row) => formatAmount(row.debit),
    },

    {
        header: "Credit",
        accessor: "credit",
        render: (row) => formatAmount(row.credit),
    },

    {
        header: "Balance",
        accessor: "balance",
        render: (row) => formatAmount(row.balance),
    },
];

export const dashboardSummaryStats = (data = {}) => [
    {
        title: "Total Receivable",
        count: formatAmount(data.total_receivable),
        icon: <FiDollarSign />,
        backgroundColor: "#EEF2FF",
        iconColor: "#4F46E5",
    },

    {
        title: "Total Invoice",
        count: formatAmount(data.total_invoice),
        icon: <FiFileText />,
        backgroundColor: "#FFF4E5",
        iconColor: "#F59E0B",
    },

    {
        title: "Total Collection",
        count: formatAmount(data.total_collection),
        icon: <FiArrowDownCircle />,
        backgroundColor: "#E8F8EF",
        iconColor: "#22A06B",
    },

    {
        title: "Total Credit",
        count: formatAmount(data.total_credit),
        icon: <FiCheckCircle />,
        backgroundColor: "#E0F3F7",
        iconColor: "#4455EF",
    },

    {
        title: "Overdue",
        count: formatAmount(data.overdue_amount),
        icon: <FiArrowUpCircle />,
        backgroundColor: "#FDECEC",
        iconColor: "#E5484D",
    },
];

// Kept for potential future use
// e.g. a per-customer detail view backed by
// GET /finance/ledger/summary/?customer_id=...
export const customerLedgerStats = (data = {}) => [
    {
        title: "Total Debit",
        count: formatAmount(data.total_debit),
        icon: <FiArrowUpCircle />,
        backgroundColor: "#FDECEC",
        iconColor: "#E5484D",
    },

    {
        title: "Total Credit",
        count: formatAmount(data.total_credit),
        icon: <FiArrowDownCircle />,
        backgroundColor: "#E8F8EF",
        iconColor: "#22A06B",
    },

    {
        title: "Closing Balance",
        count: formatAmount(data.closing_balance),
        icon: <FiDollarSign />,
        backgroundColor: "#EEF2FF",
        iconColor: "#4F46E5",
    },

    {
        title: "Entries",
        count: data.entry_count || 0,
        icon: <FiFileText />,
        backgroundColor: "#F3EFEC",
        iconColor: "#6B7280",
    },
];

export const getCustomerSummaryColumns = () => [
    {
        header: "Customer",
        accessor: "customer_name",
    },

    {
        header: "Customer ID",
        accessor: "customer_id_code",
    },

    {
        header: "Total Debit",
        accessor: "total_debit",
        render: (row) => formatAmount(row.total_debit),
    },

    {
        header: "Total Credit",
        accessor: "total_credit",
        render: (row) => formatAmount(row.total_credit),
    },

    {
        header: "Balance",
        accessor: "balance",
        render: (row) => formatAmount(row.balance),
    },
];