import React, { useEffect, useMemo, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import ReusableConfirmModal from "../../../../Components/modals/ReusableConfirmModal";

import {
    DateRangeWrapper,
    DatePickerContainer,
    DateInput,
    DateSeparator,
} from "./SalesOrder.styles";

import {
    getSalesOrderColumns,
    buildSalesOrderStats,
    ORDER_STATUS_OPTIONS,
} from "./SalesOrders.columns";

import {
    getSalesOrders,
    getSalesOrderSummary,
    getCustomers,
    removeSalesOrder,
    selectSalesOrders,
    selectSalesOrderPagination,
    selectSalesOrderKPI,
    selectSalesOrderLoading,
    selectCustomers,
} from "../../../../Redux/finance/Sales/Salesorderslice";

const getCurrentMonthRange = () => {
    const today = new Date(2026, 8, 21); // Sep 21, 2026

    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    return { start: formatDate(firstDay), end: formatDate(lastDay) };
};

const useDebouncedValue = (value, delay = 400) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
};

const SalesOrder = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentMonth = getCurrentMonthRange();

    const salesOrders = useSelector(selectSalesOrders);
    const pagination = useSelector(selectSalesOrderPagination);
    const kpi = useSelector(selectSalesOrderKPI);
    const loading = useSelector(selectSalesOrderLoading);
    const customers = useSelector(selectCustomers);

    const [search, setSearch] = useState("");
    const [orderStatus, setOrderStatus] = useState("");
    const [customer, setCustomer] = useState("");
    const [startDate, setStartDate] = useState(currentMonth.start);
    const [endDate, setEndDate] = useState(currentMonth.end);
    const [currentPage, setCurrentPage] = useState(1);

    // Delete confirmation modal state
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [deleteError, setDeleteError] = useState("");
    const debouncedSearch = useDebouncedValue(search);

    useEffect(() => {
        dispatch(getCustomers());
    }, [dispatch]);

    const customerOptions = useMemo(
        () =>
            customers.map((c) => ({
                label: c.name || c.customer_name || `Customer #${c.id}`,
                value: String(c.id),
            })),
        [customers]
    );

    useEffect(() => {
        const params = { page: currentPage };

        if (debouncedSearch) params.search = debouncedSearch;
        if (orderStatus) params.order_status = orderStatus;
        if (customer) params.customer = customer;
        if (startDate) params.order_date_after = startDate;
        if (endDate) params.order_date_before = endDate;

        dispatch(getSalesOrders(params));
    }, [dispatch, debouncedSearch, orderStatus, customer, startDate, endDate, currentPage]);

    useEffect(() => {
        dispatch(getSalesOrderSummary());
    }, [dispatch]);

    const stats = useMemo(() => buildSalesOrderStats(kpi), [kpi]);

    const handleStartDateChange = (e) => {
        const value = e.target.value;
        setCurrentPage(1);
        if (!value) {
            setStartDate("");
            return;
        }
        setStartDate(value);
        if (endDate && value > endDate) setEndDate(value);
    };

    const handleEndDateChange = (e) => {
        const value = e.target.value;
        if (!value) {
            setEndDate("");
            setCurrentPage(1);
            return;
        }
        if (startDate && value < startDate) return;
        setEndDate(value);
        setCurrentPage(1);
    };

    const handleDelete = (order) => {
        setDeleteError("");
        setOrderToDelete(order);
    };

    const handleCloseDeleteModal = () => {
        setOrderToDelete(null);
        setDeleteError("");
    };

    const handleConfirmDelete = async () => {
        if (!orderToDelete) return;

        setDeleteError("");

        const result = await dispatch(
            removeSalesOrder(orderToDelete.id)
        );

        if (!result.error) {
            dispatch(getSalesOrderSummary());
            setOrderToDelete(null);
            return;
        }

        const errorMessage =
            result.payload?.detail ||
            result.payload?.message ||
            "This Sales Order cannot be deleted.";

        setDeleteError(errorMessage);
    };
    const columns = useMemo(
        () => getSalesOrderColumns({ onDelete: handleDelete }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Sales Orders"
                breadcrumbs={["Sales", "Sales Orders"]}
                buttonText="+ ADD NEW SALES ORDER"
                onButtonClick={() => navigate("/sales/orders/add")}
            >
                <DateRangeWrapper>
                    <DatePickerContainer>
                        <DateInput
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            max={endDate || undefined}
                            aria-label="Start date"
                        />
                        <DateSeparator>-</DateSeparator>
                        <DateInput
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            min={startDate || undefined}
                            aria-label="End date"
                        />
                    </DatePickerContainer>
                </DateRangeWrapper>
            </ReusableHeader>

            <StatsCards cards={stats} />

            <ReusableFilter
                search={search}
                onSearch={(value) => {
                    setSearch(value);
                    setCurrentPage(1);
                }}
                searchPlaceholder="Search SO Number or Customer"
                showSearch
                status={orderStatus}
                statuses={ORDER_STATUS_OPTIONS.map((s) => s.label)}
                onStatus={(value) => {
                    const match = ORDER_STATUS_OPTIONS.find(
                        (s) => s.label === value
                    );
                    setOrderStatus(match ? match.value : "");
                    setCurrentPage(1);
                }}
                showStatus
                filters={[
                    {
                        key: "customer",
                        value: customer,
                        onChange: (value) => {
                            setCustomer(value);
                            setCurrentPage(1);
                        },
                        options: customerOptions,
                        placeholder: "All Customers",
                    },
                ]}

            />

            <ReusableTable
                columns={columns}
                data={salesOrders}
                loading={loading}
            />

            <ReusablePagination
                currentPage={pagination.currentPage || currentPage}
                totalPages={pagination.totalPages || 1}
                onPageChange={setCurrentPage}
            />

            <ReusableConfirmModal
                show={!!orderToDelete}
                title={deleteError ? "Unable to Delete Sales Order" : "Delete Sales Order"}
                message={
                    deleteError ||
                    (orderToDelete
                        ? `Are you sure you want to delete sales order ${orderToDelete.so_number}?`
                        : "")
                }
                confirmText={deleteError ? "Close" : "Delete"}
                confirmVariant={deleteError ? "secondary" : "danger"}
                loadingText="Deleting..."
                onConfirm={
                    deleteError
                        ? handleCloseDeleteModal
                        : handleConfirmDelete
                }
                onClose={handleCloseDeleteModal}
            />
        </div>
    );
};

export default SalesOrder;