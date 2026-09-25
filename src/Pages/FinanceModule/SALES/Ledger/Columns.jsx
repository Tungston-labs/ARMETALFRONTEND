import React from "react";
import {
    FiDollarSign,
    FiArrowUpCircle,
    FiArrowDownCircle,
    FiCheckCircle,
    FiFileText,
} from "react-icons/fi";

export const formatCurrency = (value) =>
    `SAR ${Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

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
        render: (row) => formatCurrency(row.debit),
    },

    {
        header: "Credit",
        accessor: "credit",
        render: (row) => formatCurrency(row.credit),
    },

    {
        header: "Balance",
        accessor: "balance",
        render: (row) => formatCurrency(row.balance),
    },
];

export const dashboardSummaryStats = (data = {}) => [
    {
        title: "Total Receivable",
        count: data.total_receivable,
        icon: <FiDollarSign />,
        backgroundColor: "#EEF2FF",
        iconColor: "#4F46E5",
    },
    {
        title: "Total Invoice",
        count: data.total_invoice,
        icon: <FiFileText />,
        backgroundColor: "#FFF4E5",
        iconColor: "#F59E0B",
    },
    {
        title: "Total Collection",
        count: data.total_collection,
        icon: <FiArrowDownCircle />,
        backgroundColor: "#E8F8EF",
        iconColor: "#22A06B",
    },
    {
        title: "Total Credit",
        count: data.total_credit,
        icon: <FiCheckCircle />,
        backgroundColor: "#E0F3F7",
        iconColor: "#4455EF",
    },
    {
        title: "Overdue",
        count: data.overdue_amount,
        icon: <FiArrowUpCircle />,
        backgroundColor: "#FDECEC",
        iconColor: "#E5484D",
    },
];

// Kept for potential future use (e.g. a per-customer detail view backed by
// GET /finance/ledger/summary/?customer_id=...). Not currently used by
// useCustomerLedger — dashboardSummaryStats is the one wired to the cards.
export const customerLedgerStats = (data = {}) => [
    {
        title: "Total Debit",
        count: data.total_debit,
        icon: <FiArrowUpCircle />,
        backgroundColor: "#FDECEC",
        iconColor: "#E5484D",
    },
    {
        title: "Total Credit",
        count: formatCurrency(data.total_credit),
        icon: <FiArrowDownCircle />,
        backgroundColor: "#E8F8EF",
        iconColor: "#22A06B",
    },
    {
        title: "Closing Balance",
        count: formatCurrency(data.closing_balance),
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
        render: (row) => formatCurrency(row.total_debit),
    },

    {
        header: "Total Credit",
        accessor: "total_credit",
        render: (row) => formatCurrency(row.total_credit),
    },

    {
        header: "Balance",
        accessor: "balance",
        render: (row) => formatCurrency(row.balance),
    },
];