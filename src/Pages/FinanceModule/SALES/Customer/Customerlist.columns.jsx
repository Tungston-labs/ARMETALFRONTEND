import React from "react";

import {
    FiPlus,
    FiFileText,
    FiMoreVertical,
    FiEdit2,
    FiTrash2,
} from "react-icons/fi";

import {
    LinkName,
    BalanceAmount,
    ActionsCell,
    ActionButton,
    MenuWrapper,
    KebabButton,
    CircleIconButton,
} from "./CustomerList.styles";

export const getCustomerColumns = ({
    openMenuId,
    toggleActionsMenu,
    handleViewOverview,
    handleCreateInvoice,
    handleViewLedger,
    handleEditCustomer,
    handleDeleteCustomer,
}) => [
    {
        accessor: "customer_id",
        header: "Code",
        priority: 2,
    },

    {
        accessor: "customer_name",
        header: "Customer Name",
        priority: 1,
        render: (row) => (
            <LinkName type="button" onClick={() => handleViewOverview(row)}>
                {row.customer_name}
            </LinkName>
        ),
    },

    // {
    //     accessor: "credit_limit",
    //     header: "Credit Limit",
    //     priority: 4,
    // },

    {
        accessor: "total_invoices",
        header: "Total Invoices",
        priority: 4,
    },

    // {
    //     accessor: "payments_received",
    //     header: "Payments Received",
    //     priority: 5,
    // },

    {
        accessor: "balance",
        header: "Balance",
        priority: 2,
        render: (row) => (
            <BalanceAmount $negative={Number(row.balance) > 0}>
                {row.balance}
            </BalanceAmount>
        ),
    },

    {
        accessor: "outstanding_days",
        header: "Outstanding Days",
        priority: 5,
    },

    {
        accessor: "last_payment_date",
        header: "Last Payment",
        priority: 3,
    },

    {
        accessor: "actions",
        header: "Actions",
        priority: 1,
        render: (row) => {
            const rowId = row.id ?? row.customer_id;
            const isMenuOpen = openMenuId === rowId;

            return (
                <ActionsCell>
                    <ActionButton
                        type="button"
                        onClick={() => handleCreateInvoice(row)}
                    >
                        <FiPlus size={13} />
                        Invoice
                    </ActionButton>

                    <ActionButton
                        type="button"
                        onClick={() => handleViewLedger(row)}
                    >
                        <FiFileText size={13} />
                        Ledger
                    </ActionButton>

                    <MenuWrapper data-menu-root>
                        <KebabButton
                            type="button"
                            onClick={() => toggleActionsMenu(rowId)}
                            aria-label="More actions"
                            aria-expanded={isMenuOpen}
                        >
                            <FiMoreVertical size={15} />
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
                                    onClick={() => handleDeleteCustomer(row)}
                                    aria-label="Delete customer"
                                >
                                    <FiTrash2 size={13} />
                                </CircleIconButton>
                            </>
                        )}
                    </MenuWrapper>
                </ActionsCell>
            );
        },
    },
];