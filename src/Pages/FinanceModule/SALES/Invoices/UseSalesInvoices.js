import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getInvoices,
    getInvoiceSummary,
    getInvoiceCustomers,
    removeInvoice,
    clearInvoiceError,
    clearInvoiceMessage,
} from "../../../../Redux/finance/Sales/InvoiceSlice";

import {
    getSalesInvoiceColumns,
    salesInvoiceStats,
} from "./SalesInvoices.columns";

const getCurrentMonthRange = () => {
    const today = new Date();

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

    return {
        start: formatDate(firstDay),
        end: formatDate(lastDay),
    };
};

/*
 * UI status labels -> API payment_status values
 *
 * Paid            -> paid
 * Partially Paid  -> partially_paid
 * Pending         -> unpaid
 */
const STATUS_VALUE_MAP = {
    Paid: "paid",
    "Partially Paid": "partially_paid",
    Pending: "unpaid",
};

const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const useSalesInvoices = () => {
    const dispatch = useDispatch();

    const currentMonth = useMemo(
        () => getCurrentMonthRange(),
        []
    );

    // --------------------------------------------------
    // REDUX STATE
    // --------------------------------------------------

    const invoices = useSelector(
        (state) => state.invoice.invoices
    );

    const totalItems = useSelector(
        (state) => state.invoice.totalItems
    );

    const totalPages = useSelector(
        (state) => state.invoice.totalPages
    );

    const loading = useSelector(
        (state) => state.invoice.loading
    );

    const summary = useSelector(
        (state) => state.invoice.summary
    );

    const summaryLoading = useSelector(
        (state) => state.invoice.summaryLoading
    );

    const customers = useSelector(
        (state) => state.invoice.customers
    );

    const deleteLoading = useSelector(
        (state) => state.invoice.deleteLoading
    );

    const error = useSelector(
        (state) => state.invoice.error
    );

    const successMessage = useSelector(
        (state) => state.invoice.successMessage
    );

    // --------------------------------------------------
    // LOCAL FILTER / PAGINATION STATE
    // --------------------------------------------------

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("");

    const [customer, setCustomer] = useState("");

    const [dueDate, setDueDate] = useState("");

    const [startDate, setStartDate] = useState(
        currentMonth.start
    );

    const [endDate, setEndDate] = useState(
        currentMonth.end
    );

    const [currentPage, setCurrentPage] = useState(1);

    const rowsPerPage = 10;

    // --------------------------------------------------
    // DELETE MODAL STATE
    // --------------------------------------------------

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        invoice: null,
        loading: false,
    });

    // --------------------------------------------------
    // BUILD API QUERY PARAMS
    // --------------------------------------------------

    const buildParams = useCallback(() => {
        const params = {
            page: currentPage,
            page_size: rowsPerPage,
            ordering: "-created_at",
        };

        // Search
        if (search.trim()) {
            params.search = search.trim();
        }

        // Payment status
        if (status) {
            params.payment_status =
                STATUS_VALUE_MAP[status] || status;
        }

        // Customer
        if (customer) {
            params.customer = customer;
        }

        // Invoice date range
        if (startDate) {
            params.invoice_date_after = startDate;
        }

        if (endDate) {
            params.invoice_date_before = endDate;
        }

        // --------------------------------------------------
        // Due Date Filters
        // --------------------------------------------------

        if (dueDate) {
            const today = new Date();

            today.setHours(0, 0, 0, 0);

            if (dueDate === "due_today") {
                params.due_date =
                    formatLocalDate(today);
            }

            if (dueDate === "due_week") {
                const weekEnd = new Date(today);

                weekEnd.setDate(
                    today.getDate() + 7
                );

                params.due_date_after =
                    formatLocalDate(today);

                params.due_date_before =
                    formatLocalDate(weekEnd);
            }

            if (dueDate === "overdue") {
                const yesterday = new Date(today);

                yesterday.setDate(
                    today.getDate() - 1
                );

                params.due_date_before =
                    formatLocalDate(yesterday);
            }

            if (dueDate === "due_later") {
                const weekEnd = new Date(today);

                weekEnd.setDate(
                    today.getDate() + 7
                );

                params.due_date_after =
                    formatLocalDate(weekEnd);
            }
        }

        return params;
    }, [
        search,
        status,
        customer,
        dueDate,
        startDate,
        endDate,
        currentPage,
    ]);

    // --------------------------------------------------
    // FETCH INVOICES
    // --------------------------------------------------

    useEffect(() => {
        dispatch(
            getInvoices(buildParams())
        );
    }, [
        dispatch,
        buildParams,
    ]);

    // --------------------------------------------------
    // FETCH SUMMARY
    // --------------------------------------------------

    useEffect(() => {
        const params = {};

        if (status) {
            params.payment_status =
                STATUS_VALUE_MAP[status] || status;
        }

        if (customer) {
            params.customer = customer;
        }

        dispatch(
            getInvoiceSummary(params)
        );
    }, [
        dispatch,
        status,
        customer,
    ]);

    // --------------------------------------------------
    // FETCH CUSTOMERS
    // --------------------------------------------------

    useEffect(() => {
        dispatch(
            getInvoiceCustomers()
        );
    }, [dispatch]);

    // --------------------------------------------------
    // CLEAR SUCCESS / ERROR MESSAGES
    // --------------------------------------------------

    useEffect(() => {
        if (!error && !successMessage) {
            return undefined;
        }

        const timer = setTimeout(() => {
            dispatch(
                clearInvoiceError()
            );

            dispatch(
                clearInvoiceMessage()
            );
        }, 4000);

        return () => {
            clearTimeout(timer);
        };
    }, [
        dispatch,
        error,
        successMessage,
    ]);

    // --------------------------------------------------
    // FILTER HANDLERS
    // --------------------------------------------------

    const handleSearch = useCallback((value) => {
        setSearch(value);
        setCurrentPage(1);
    }, []);

    const handleStatus = useCallback((value) => {
        setStatus(value);
        setCurrentPage(1);
    }, []);

    const handleCustomer = useCallback((value) => {
        setCustomer(value);
        setCurrentPage(1);
    }, []);

    const handleDueDate = useCallback((value) => {
        setDueDate(value);
        setCurrentPage(1);
    }, []);

    // --------------------------------------------------
    // DATE HANDLERS
    // --------------------------------------------------

    const handleStartDateChange = useCallback(
        (e) => {
            const value = e.target.value;

            if (!value) {
                setStartDate("");
                setCurrentPage(1);
                return;
            }

            setStartDate(value);
            setCurrentPage(1);

            if (
                endDate &&
                value > endDate
            ) {
                setEndDate(value);
            }
        },
        [endDate]
    );

    const handleEndDateChange = useCallback(
        (e) => {
            const value = e.target.value;

            if (!value) {
                setEndDate("");
                setCurrentPage(1);
                return;
            }

            if (
                startDate &&
                value < startDate
            ) {
                return;
            }

            setEndDate(value);
            setCurrentPage(1);
        },
        [startDate]
    );

    // --------------------------------------------------
    // OPEN DELETE MODAL
    // --------------------------------------------------

const handleDeleteInvoice = useCallback((invoice) => {
    console.log("DELETE CLICKED:", invoice);

    if (!invoice?.id) {
        console.error("Invoice ID is missing:", invoice);
        return;
    }

    setDeleteModal({
        isOpen: true,
        invoice,
        loading: false,
    });
}, []);

const handleDeleteCancel = useCallback(() => {
    setDeleteModal({
        isOpen: false,
        invoice: null,
        loading: false,
    });
}, []);

const handleDeleteConfirm = useCallback(async () => {
    const invoice = deleteModal.invoice;

    console.log("CONFIRM DELETE:", invoice);
    console.log("DELETE ID:", invoice?.id);

    if (!invoice?.id) {
        console.error("Cannot delete invoice: ID missing");
        return;
    }

    try {
        setDeleteModal((prev) => ({
            ...prev,
            loading: true,
        }));

        console.log(
            "Dispatching removeInvoice:",
            invoice.id
        );

        await dispatch(
            removeInvoice(invoice.id)
        ).unwrap();

        console.log(
            "Invoice deleted successfully:",
            invoice.id
        );

        setDeleteModal({
            isOpen: false,
            invoice: null,
            loading: false,
        });

        const summaryParams = {};

        if (status) {
            summaryParams.payment_status =
                STATUS_VALUE_MAP[status] || status;
        }

        if (customer) {
            summaryParams.customer = customer;
        }

        await dispatch(
            getInvoiceSummary(summaryParams)
        ).unwrap();

    } catch (deleteError) {
        console.error(
            "DELETE INVOICE FAILED:",
            deleteError
        );

        setDeleteModal((prev) => ({
            ...prev,
            loading: false,
        }));
    }
}, [
    dispatch,
    deleteModal.invoice,
    status,
    customer,
]);

    // --------------------------------------------------
    // CONFIRM DELETE
    // --------------------------------------------------


    // --------------------------------------------------
    // COLUMNS
    // --------------------------------------------------

    const salesInvoiceColumns = useMemo(
        () =>
            getSalesInvoiceColumns(
                handleDeleteInvoice
            ),
        [handleDeleteInvoice]
    );

    // --------------------------------------------------
    // EXPORT
    // --------------------------------------------------

    const handleExport = useCallback(() => {
        if (!invoices?.length) {
            console.log(
                "No data to export"
            );

            return;
        }

        const exportableColumns =
            salesInvoiceColumns.filter(
                (column) =>
                    column.accessor !==
                    "actions"
            );

        const headers =
            exportableColumns.map(
                (column) =>
                    column.header
            );

        const accessors =
            exportableColumns.map(
                (column) =>
                    column.accessor
            );

        const csvRows = [
            headers.join(","),
            ...invoices.map((row) =>
                accessors
                    .map((accessor) => {
                        const value =
                            row[accessor] ??
                            "";

                        return `"${String(
                            value
                        ).replace(
                            /"/g,
                            '""'
                        )}"`;
                    })
                    .join(",")
            ),
        ];

        const csvContent =
            csvRows.join("\n");

        const blob = new Blob(
            [csvContent],
            {
                type:
                    "text/csv;charset=utf-8;",
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "sales-invoices.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    }, [
        invoices,
        salesInvoiceColumns,
    ]);

    // --------------------------------------------------
    // STATS
    // --------------------------------------------------

    const salesOrderStats =
        salesInvoiceStats(
            summary || {}
        );

    // --------------------------------------------------
    // CUSTOMER OPTIONS
    // --------------------------------------------------

    const customerOptions = useMemo(
        () =>
            (customers || []).map(
                (c) => ({
                    label:
                        c.name ||
                        c.display_name ||
                        c.customer_name ||
                        "Unknown Customer",

                    value: String(
                        c.id
                    ),
                })
            ),
        [customers]
    );

    // --------------------------------------------------
    // RETURN
    // --------------------------------------------------

    return {
        // Table
        salesInvoiceColumns,
        paginatedData: invoices,

        // Pagination
        totalRecords: totalItems,
        totalPages,
        rowsPerPage,

        // Loading
        loading,
        summaryLoading,
        deleteLoading,

        // Messages
        error,
        successMessage,

        // Filters
        search,
        status,
        customer,
        dueDate,

        // Date range
        startDate,
        endDate,

        // Pagination state
        currentPage,

        // Stats
        salesOrderStats,

        // Customers
        customerOptions,

        // Delete modal
        deleteModal,

        // Handlers
        handleSearch,
        handleStatus,
        handleCustomer,
        handleDueDate,

        handleStartDateChange,
        handleEndDateChange,

        handleExport,

        handleDeleteCancel,
        handleDeleteConfirm,

        setCurrentPage,
    };
};

export default useSalesInvoices;