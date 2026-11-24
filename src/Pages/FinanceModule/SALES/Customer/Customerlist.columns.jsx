import React from "react";

import { FiEdit2, FiArchive } from "react-icons/fi";

import {
    LinkName,
    BalanceAmount,
    ActionsCell,
    CircleIconButton,
    ArchivedBalance,
    ArchiveActionButton,
    StatusBadge,
} from "./CustomerList.styles";
import { formatDate } from "../../../../utils/Formatdate";

const money = (v) => `SAR ${Number(v || 0).toLocaleString("en-US")}`;

export const getCustomerColumns = ({
    status,
    handleViewOverview,
    handleEditCustomer,
    handleArchiveCustomer,
    handleRestoreCustomer,
    handleDeleteCustomerPermanently,
}) => {
    // ================= ARCHIVED VIEW (screenshot layout) =================
    if (status === "archived") {
        return [
            { accessor: "customer_id", header: "Code" },
            {
                accessor: "customer_name",
                header: "Customer Name",
                render: (row) => (
                    <LinkName
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleViewOverview(row);
                        }}
                    >
                        {row.customer_name}
                    </LinkName>
                ),
            },
            {
                accessor: "credit_limit",
                header: "Credit Limit",
                render: (row) => money(row.credit_limit),
            },
            {
                accessor: "total_invoice",
                header: "Total Invoices",
                render: (row) => money(row.total_invoice),
            },
            {
                accessor: "total_payments_received",
                header: "Payments Received",
                render: (row) => money(row.total_payments_received),
            },
            {
                accessor: "balance_amount",
                header: "Balance",
                render: (row) => (
                    <ArchivedBalance $due={Number(row.balance_amount) > 0}>
                        {money(row.balance_amount)}
                    </ArchivedBalance>
                ),
            },
            {
                accessor: "archived_at",
                header: "Archived On",
                render: (row) => formatDate(row.archived_at),
            },
            {
                accessor: "archived_by_name",
                header: "Archived By",
                render: (row) => row.archived_by_name || "-",
            },
            {
                accessor: "actions",
                header: "Actions",
                render: (row) => (
                    <ActionsCell style={{ flexWrap: "nowrap" }}>
                        <ArchiveActionButton
                            type="button"
                            $variant="restore"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRestoreCustomer(row);
                            }}
                        >
                            Restore
                        </ArchiveActionButton>
                        <ArchiveActionButton
                            type="button"
                            $variant="delete"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCustomerPermanently(row);
                            }}
                        >
                            Delete
                        </ArchiveActionButton>
                    </ActionsCell>
                ),
            },
        ];
    }

    // ================= ACTIVE / INACTIVE VIEW =================
    return [
        { accessor: "customer_id", header: "Code" },
        {
            accessor: "customer_name",
            header: "Customer Name",
            render: (row) => (
                <LinkName type="button" onClick={() => handleViewOverview(row)}>
                    {row.customer_name}
                </LinkName>
            ),
        },
        { accessor: "credit_limit", header: "Credit Limit" },
        { accessor: "total_invoice", header: "Total Invoices" },
        { accessor: "total_payments_received", header: "Payments Received" },
        {
            accessor: "balance_amount",
            header: "Balance",
            render: (row) => (
                <BalanceAmount $negative={Number(row.balance_amount) > 0}>
                    {row.balance_amount}
                </BalanceAmount>
            ),
        },
        { accessor: "outstanding_days", header: "Outstanding Days" },
        {
            accessor: "last_payment",
            header: "Last Payment",
            render: (row) => formatDate(row.last_payment),
        },
        {
            accessor: "client_status_name",
            header: "Status",
            render: (row) => (
                <StatusBadge $status={row.client_status}>
                    {row.client_status_name}
                </StatusBadge>
            ),
        },
        {
            accessor: "actions",
            header: "Actions",
            sortable: false,
            render: (row) => (
                <ActionsCell style={{ flexWrap: "nowrap" }}>
                    <CircleIconButton
                        type="button"
                        $variant="edit"
                        title="Edit Customer"
                        aria-label="Edit customer"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditCustomer(row);
                        }}
                    >
                        <FiEdit2 size={13} />
                    </CircleIconButton>

                    <CircleIconButton
                        type="button"
                        $variant="delete"
                        title="Archive Customer"
                        aria-label="Archive customer"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleArchiveCustomer(row);
                        }}
                    >
                        <FiArchive size={13} />
                    </CircleIconButton>
                </ActionsCell>
            ),
        },

    ];
};