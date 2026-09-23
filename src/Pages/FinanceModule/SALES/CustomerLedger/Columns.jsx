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

/**
 * customerLedgerStats
 * ----------------------
 * Builds the stats cards from a `stats` object — pass in whatever
 * you have available:
 *   - the per-customer `/ledger/summary/?customer_id=` payload
 *     (opening_balance, total_debit, total_credit, closing_balance), or
 *   - page-level totals computed client-side from the loaded rows
 *     (total_debit, total_credit, entry_count) when no customer filter
 *     is active and the summary endpoint can't be called.
 *
 * Any field not present in `stats` defaults to 0 rather than blowing up.
 */
export const customerLedgerStats = (stats = {}) => [
    {
        title: "Opening Balance",
        count: formatCurrency(stats.opening_balance ?? 0),
        icon: <FiDollarSign />,
        backgroundColor: "#EEF2FF",
        iconColor: "#4F46E5",
    },

    {
        title: "Total Debit",
        count: formatCurrency(stats.total_debit ?? 0),
        icon: <FiArrowUpCircle />,
        backgroundColor: "#FFF4E5",
        iconColor: "#F59E0B",
    },

    {
        title: "Total Credit",
        count: formatCurrency(stats.total_credit ?? 0),
        icon: <FiArrowDownCircle />,
        backgroundColor: "#E8F8EF",
        iconColor: "#22A06B",
    },

    {
        title: "Closing Balance",
        count: formatCurrency(stats.closing_balance ?? 0),
        icon: <FiCheckCircle />,
        backgroundColor: "#E0F3F7",
        iconColor: "#4455EF",
    },

    {
        title: "Entries",
        count: String(stats.entry_count ?? 0).padStart(2, "0"),
        icon: <FiFileText />,
        backgroundColor: "#F3EFEC",
        iconColor: "#000000",
    },
];