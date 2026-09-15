import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiFileText, FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";

import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";

import CustomerModal from "./modal/CustomerModal";

import {
    getCustomers,
    getCustomerById,
    addCustomer,
    editCustomer,
    removeCustomer,
} from "../../../../Redux/finance/CustomerSlice";

import {
    LinkName,
    BalanceAmount,
    ActionsCell,
    ActionButton,
    MenuWrapper,
    KebabButton,
    CircleIconButton,
} from "./CustomerList.styles";

const CustomerList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        customers,
        totalPages,
        currentPage,
        loading,
        selectedCustomer,
    } = useSelector((state) => state.customer);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [isCustomerModalOpen, setIsCustomerModalOpen] =
        useState(false);

    const [modalMode, setModalMode] = useState("add");

    const [editingCustomer, setEditingCustomer] =
        useState(null);

    // Which row's info dropdown (Edit / Delete) is currently open.
    // Only one open at a time; clicking anywhere outside a menu
    // wrapper (identified by data-menu-root) closes it.
    const [openMenuId, setOpenMenuId] = useState(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest("[data-menu-root]")) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleActionsMenu = (rowId) => {
        setOpenMenuId((prev) => (prev === rowId ? null : rowId));
    };

    const rowsPerPage = 10;

    // ============================================================
    // FETCH CUSTOMERS
    // ============================================================

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(
                getCustomers({
                    search: search.trim(),
                    page,
                    page_size: rowsPerPage,
                })
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [dispatch, search, page]);

    // ============================================================
    // ADD CUSTOMER
    // ============================================================

    const handleAddCustomer = () => {
        setModalMode("add");
        setEditingCustomer(null);
        setIsCustomerModalOpen(true);
    };

    // ============================================================
    // VIEW CUSTOMER
    // ============================================================

    const handleViewCustomer = (customer) => {
        dispatch(getCustomerById(customer.id));

        setModalMode("view");
        setEditingCustomer(customer);
        setIsCustomerModalOpen(true);
    };

    // ============================================================
    // EDIT CUSTOMER
    // ============================================================

    const handleEditCustomer = (customer) => {
        dispatch(getCustomerById(customer.id));

        setModalMode("edit");
        setEditingCustomer(customer);
        setIsCustomerModalOpen(true);
    };

    // ============================================================
    // DELETE CUSTOMER
    // ============================================================

    const handleDeleteCustomer = (customer) => {
        if (!customer?.id) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete ${customer.customer_name}?`
        );

        if (!confirmed) return;

        dispatch(removeCustomer(customer.id));
    };

    // ============================================================
    // SAVE CUSTOMER
    // ============================================================

    const handleSaveCustomer = async (customerData) => {
        if (modalMode === "edit" && editingCustomer?.id) {
            const result = await dispatch(
                editCustomer({
                    id: editingCustomer.id,
                    customerData,
                })
            );

            if (!result.error) {
                setIsCustomerModalOpen(false);

                dispatch(
                    getCustomers({
                        search: search.trim(),
                        page,
                        page_size: rowsPerPage,
                    })
                );
            }

            return;
        }

        const result = await dispatch(
            addCustomer(customerData)
        );

        if (!result.error) {
            setIsCustomerModalOpen(false);

            dispatch(
                getCustomers({
                    search: search.trim(),
                    page,
                    page_size: rowsPerPage,
                })
            );
        }
    };

    // ============================================================
    // CLOSE MODAL
    // ============================================================

    const handleCloseCustomerModal = () => {
        setIsCustomerModalOpen(false);
        setEditingCustomer(null);
    };

    // ============================================================
    // ROW ACTION HANDLERS (Invoice / Ledger / Overview)
    // ============================================================

    // These navigate relative to the current "sales/customers" route,
    // landing on the matching nested route under
    // "sales/customers/:customerId" defined in FinanceRoutes.
    const handleCreateInvoice = (customer) => {
        if (!customer?.id) return;
        navigate(`${customer.id}/invoices`);
    };

    const handleViewLedger = (customer) => {
        if (!customer?.id) return;
        navigate(`${customer.id}/ledger`);
    };

    const handleViewOverview = (customer) => {
        if (!customer?.id) return;
        navigate(`${customer.id}/overview`);
    };

    // ============================================================
    // TABLE COLUMNS
    // ============================================================

    // Widths are chosen so the row adds up to 100%: short/fixed content
    // (Code, Outstanding Days, dates) gets just enough room, longer money
    // columns get more, and Actions gets a fixed px width big enough for
    // its three buttons so it never gets squeezed by the others.
    const customerColumns = [
        { accessor: "customer_id", header: "Code", width: "9%" },
        {
            accessor: "customer_name",
            header: "Customer Name",
            width: "13%",
            render: (row) => (
                <LinkName
                    type="button"
                    onClick={() => handleViewOverview(row)}
                >
                    {row.customer_name}
                </LinkName>
            ),
        },
        { accessor: "credit_limit", header: "Credit Limit", width: "10%" },
        { accessor: "total_invoices", header: "Total Invoices", width: "10%" },
        {
            accessor: "payments_received",
            header: "Payments Received",
            width: "10%",
        },
        {
            accessor: "balance",
            header: "Balance",
            width: "10%",
            render: (row) => (
                <BalanceAmount $negative={Number(row.balance) > 0}>
                    {row.balance}
                </BalanceAmount>
            ),
        },
        {
            accessor: "outstanding_days",
            header: "Outstanding Days",
            width: "10%",
        },
        { accessor: "last_payment_date", header: "Last Payment", width: "9%" },
        {
            accessor: "actions",
            header: "Actions",
            width: "300px",
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
                                        onClick={() => {
                                            setOpenMenuId(null);
                                            handleEditCustomer(row);
                                        }}
                                        aria-label="Edit customer"
                                    >
                                        <FiEdit2 size={13} />
                                    </CircleIconButton>

                                    <CircleIconButton
                                        type="button"
                                        $variant="delete"
                                        onClick={() => {
                                            setOpenMenuId(null);
                                            handleDeleteCustomer(row);
                                        }}
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

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Customers"
                breadcrumbs={["Sales", "Customers"]}
                buttonText="ADD NEW CUSTOMER"
                onButtonClick={handleAddCustomer}
            />

            <ReusableFilter
                search={search}
                onSearch={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
                showSearch
            />

            <ReusableTable
                columns={customerColumns}
                data={customers}
                loading={loading}
                onView={handleViewCustomer}
                onEdit={handleEditCustomer}
                onDelete={handleDeleteCustomer}
            />

            <ReusablePagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            <CustomerModal
                isOpen={isCustomerModalOpen}
                onClose={handleCloseCustomerModal}
                mode={modalMode}
                customer={
                    selectedCustomer || editingCustomer
                }
                onSave={handleSaveCustomer}
            />
        </div>
    );
};

export default CustomerList;