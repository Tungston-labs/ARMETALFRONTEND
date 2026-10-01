import React from "react";

import {
    FiFileText,
    FiDollarSign,
    FiCheckCircle,
    FiClock,
    FiXCircle,
} from "react-icons/fi";

import DebitNoteActions from "../DebitNotes/action/DebitNoteActions";

/* =========================================================
   HELPERS
========================================================= */

export const formatAmount = (value) => {
    const number = Number(value || 0);

    return number.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

export const formatDate = (value) => {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};

const humanize = (value) => {
    if (!value) {
        return "-";
    }

    return String(value)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character) =>
            character.toUpperCase()
        );
};

/* =========================================================
   STATUS
========================================================= */

export const STATUS_META = {
    issued: {
        label: "Issued",
        color: "#16A34A",
    },

    pending: {
        label: "Pending",
        color: "#F97316",
    },

    applied: {
        label: "Applied",
        color: "#16A34A",
    },

    cancelled: {
        label: "Cancelled",
        color: "#EF4444",
    },
};

const StatusBadge = ({ status }) => {
    const key = String(status || "").toLowerCase();

    const meta = STATUS_META[key] || {
        label: humanize(status),
        color: "#6B7280",
    };

    return (
        <span
            style={{
                color: meta.color,
                fontSize: "12px",
                whiteSpace: "nowrap",
            }}
        >
            {meta.label}
        </span>
    );
};

/* =========================================================
   DEBIT NOTE COLUMNS
========================================================= */

export const getDebitNoteColumns = ({
    onDelete,
    onDownload,
} = {}) => [
    {
        header: "Debit Note No",
        accessor: "debit_note_number",

        render: (row) =>
            row.debit_note_number ||
            row.debitNoteNo ||
            "-",
    },

    {
        header: "Vendor",
        accessor: "vendor_name",

        render: (row) =>
            row.vendor_name ||
            row.vendor?.name ||
            row.vendorName ||
            "-",
    },

    {
        header: "Against Bill",
        accessor: "bill_number",

        render: (row) =>
            row.bill_number ||
            row.bill?.bill_number ||
            row.against_bill ||
            row.againstBill ||
            "-",
    },

    {
        header: "Date Issued",
        accessor: "issue_date",

        render: (row) =>
            formatDate(
                row.issue_date ||
                    row.date_issued ||
                    row.dateIssued
            ),
    },

    {
        header: "Reason",
        accessor: "reason",

        render: (row) => humanize(row.reason),
    },

    {
        header: "Bill Amt (SAR)",
        accessor: "bill_amount",

        render: (row) =>
            formatAmount(
                row.bill_amount ??
                    row.bill_value ??
                    row.billAmount
            ),
    },

    {
        header: "Debit Amt (SAR)",
        accessor: "debit_amount",

        render: (row) =>
            formatAmount(
                row.debit_amount ??
                    row.debitAmount
            ),
    },

    {
        header: "After Applied (SAR)",
        accessor: "remaining_amount",

        render: (row) => {
            const value =
                row.remaining_amount ??
                row.after_applied ??
                row.afterApplied;

            if (
                value === null ||
                value === undefined ||
                value === ""
            ) {
                return "-";
            }

            return formatAmount(value);
        },
    },

    {
        header: "Status",
        accessor: "status",

        render: (row) => (
            <StatusBadge status={row.status} />
        ),
    },

    {
        header: "Action",
        accessor: "actions",
        sortable: false,

        render: (row) => (
            <DebitNoteActions
                row={row}
                onDelete={onDelete}
                onDownload={onDownload}
            />
        ),
    },
];

/* =========================================================
   KPI CARDS
========================================================= */

const pickValue = (object, keys, fallback = 0) => {
    for (const key of keys) {
        if (
            object?.[key] !== undefined &&
            object?.[key] !== null
        ) {
            return object[key];
        }
    }

    return fallback;
};

export const debitNoteStats = (kpi = {}) => {
    const data = kpi?.data || kpi || {};

    const totalDebitNotes = pickValue(data, [
        "total_debit_notes",
        "total_debit_note",
        "total_notes",
        "total",
    ]);

    const totalDebitValue = pickValue(data, [
        "total_debit_value",
        "total_debit_amount",
        "total_value",
    ]);

    const appliedToBills = pickValue(data, [
        "applied_to_bills",
        "applied_amount",
        "total_applied",
    ]);

    const pendingUnapplied = pickValue(data, [
        "pending_unapplied",
        "pending_amount",
        "total_pending",
        "unapplied_amount",
    ]);

    const cancelledNotes = pickValue(data, [
        "cancelled_notes",
        "cancelled_count",
        "total_cancelled",
    ]);

    return [
        {
            title: "Total Debit Notes",
            count: totalDebitNotes,
            icon: <FiFileText size={22} />,
            backgroundColor: "#ECFDF5",
            iconColor: "#16A34A",
        },

        {
            title: "Total Debit Value",
            count: `SAR ${formatAmount(
                totalDebitValue
            )}`,
            icon: <FiFileText size={22} />,
            backgroundColor: "#F3E8FF",
            iconColor: "#9333EA",
        },

        {
            title: "Applied to Bills",
            count: `SAR ${formatAmount(
                appliedToBills
            )}`,
            icon: <FiCheckCircle size={22} />,
            backgroundColor: "#ECFDF5",
            iconColor: "#16A34A",
        },

        {
            title: "Pending / Unapplied",
            count: `SAR ${formatAmount(
                pendingUnapplied
            )}`,
            icon: <FiClock size={22} />,
            backgroundColor: "#FFF7ED",
            iconColor: "#F97316",
        },

        {
            title: "Cancelled Notes",
            count: cancelledNotes,
            icon: <FiXCircle size={22} />,
            backgroundColor: "#FEF2F2",
            iconColor: "#EF4444",
        },
    ];
};