import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

const CustomerList = () => {
    const dispatch = useDispatch();

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
    // TABLE COLUMNS
    // ============================================================

 const customerColumns = [
    { accessor: "customer_id", header: "CUSTOMER ID" },
    { accessor: "customer_name", header: "CUSTOMER NAME" },
    { accessor: "company_name", header: "COMPANY" },
    { accessor: "industry_name", header: "INDUSTRY" },
    { accessor: "currency_name", header: "CURRENCY" },
    { accessor: "payment_term_name", header: "PAYMENT TERM" },
    { accessor: "client_status_name", header: "STATUS" },
    { accessor: "credit_limit", header: "CREDIT LIMIT" },
    { accessor: "opening_balance", header: "OPENING BALANCE" },
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