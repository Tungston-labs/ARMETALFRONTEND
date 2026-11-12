import React from "react";

import { FiEdit2, FiArchive } from "react-icons/fi";
import { IoEllipsisVerticalCircleOutline } from "react-icons/io5";

import {
    LinkName,
    BalanceAmount,
    ActionsCell,
    MenuWrapper,
    KebabButton,
    CircleIconButton,
    ArchivedBalance,
    ArchiveActionButton,
    StatusBadge,
} from "./CustomerList.styles";
import { formatDate } from "../../../../utils/Formatdate";

const money = (v) => `SAR ${Number(v || 0).toLocaleString("en-US")}`;



export const getCustomerColumns = ({
    status,
    openMenuId,
    toggleActionsMenu,
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
                    <LinkName type="button" onClick={() => handleViewOverview(row)}>
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
                            onClick={() => handleRestoreCustomer(row)}
                        >
                            Restore
                        </ArchiveActionButton>
                        <ArchiveActionButton
                            type="button"
                            $variant="delete"
                            onClick={() => handleDeleteCustomerPermanently(row)}
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
            render: (row) => {
                const rowId = row.id ?? row.customer_id;
                const isMenuOpen = openMenuId === rowId;

                return (
                    <ActionsCell>
                        <MenuWrapper data-menu-root>
                            <KebabButton
                                type="button"
                                onClick={() => toggleActionsMenu(rowId)}
                                aria-label="More actions"
                                aria-expanded={isMenuOpen}
                            >
                                <IoEllipsisVerticalCircleOutline size={14} />
                            </KebabButton>

                            {isMenuOpen && (
                                <>
                                    <CircleIconButton
                                        type="button"
                                        $variant="edit"
                                        onClick={() => handleEditCustomer(row)}
                                        aria-label="Edit customer"
                                    >
                                        <FiEdit2 size={13} />
                                    </CircleIconButton>

                                    <CircleIconButton
                                        type="button"
                                        $variant="delete"
                                        onClick={() => handleArchiveCustomer(row)}
                                        aria-label="Archive customer"
                                    >
                                        <FiArchive size={13} />
                                    </CircleIconButton>
                                </>
                            )}
                        </MenuWrapper>
                    </ActionsCell>
                );
            },
        },
    ];
};