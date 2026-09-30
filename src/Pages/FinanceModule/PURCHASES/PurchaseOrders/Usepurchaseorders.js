import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    getPurchaseOrders,
    getPurchaseOrderDashboard,
    getVendorOptions,
    removePurchaseOrder,
    clearPurchaseOrderError,
    clearPurchaseOrderMessage,
} from "../../../../Redux/finance/purchases/Purchaseordersslice";

import {
    getPurchaseOrderColumns,
    purchaseOrderStats,
} from "./Purchaseorderstats";

const ROWS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 400;
const ADD_ROUTE = "/purchases/purchase-orders/add";

const STATUS_OPTIONS = [
    "Draft",
    "Pending",
    "Approved",
    "Ordered",
    "Partially Received",
    "Received",
    "Cancelled",
];
const toStatusKey = (label) => label.toLowerCase().replace(/\s+/g, "_");

const RECEIPT_STATUS_OPTIONS = [
    { label: "Pending", value: "pending" },
    { label: "Partially Received", value: "partially_received" },
    { label: "Received", value: "received" },
];

const BILL_STATUS_OPTIONS = [
    { label: "Pending", value: "pending" },
    { label: "Partially Billed", value: "partially_billed" },
    { label: "Billed", value: "billed" },
];

// Turns a DRF error ({ field: ["msg"] } | { detail } | string) into text
const formatError = (error) => {
    if (!error) return "";
    if (typeof error === "string") return error;
    if (error.detail) return error.detail;
    return Object.entries(error)
        .map(([field, msg]) =>
            `${field}: ${Array.isArray(msg) ? msg.join(", ") : msg}`
        )
        .join(" | ");
};

const usePurchaseOrders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        purchaseOrders = [],
        totalItems = 0,
        loading = false,
        dashboard = null,
        dashboardLoading = false,
        vendorOptions: rawVendorOptions = [],
        error = null,
    } = useSelector((state) => state.purchaseOrder) || {};

    // Filters
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [vendor, setVendor] = useState("");
    const [status, setStatus] = useState("");
    const [receiptStatus, setReceiptStatus] = useState("");
    const [billStatus, setBillStatus] = useState("");

    // NOTE: the purchase order API docs don't list date params. from_date /
    // to_date are sent below; if the backend ignores them the range has no effect.
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE) || 1;

    // ---- Fetch helpers ----

    const fetchList = useCallback(() => {
        dispatch(
            getPurchaseOrders({
                search: debouncedSearch || undefined,
                vendor: vendor || undefined,
                status: status ? toStatusKey(status) : undefined,
                receipt_status: receiptStatus || undefined,
                bill_status: billStatus || undefined,
                from_date: startDate || undefined,
                to_date: endDate || undefined,
                page: currentPage,
                page_size: ROWS_PER_PAGE,
            })
        );
    }, [
        dispatch,
        debouncedSearch,
        vendor,
        status,
        receiptStatus,
        billStatus,
        startDate,
        endDate,
        currentPage,
    ]);

    const fetchDashboard = useCallback(() => {
        dispatch(getPurchaseOrderDashboard());
    }, [dispatch]);

    // ---- Effects ----

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchList();
    }, [fetchList]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    useEffect(() => {
        dispatch(getVendorOptions());
    }, [dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearPurchaseOrderError());
            dispatch(clearPurchaseOrderMessage());
        };
    }, [dispatch]);

    // Vendor dropdown rows -> { label, value } for the filter
    const vendorOptions = useMemo(
        () =>
            rawVendorOptions.map((v) => ({
                label: v.name || v.vendor_name || v.label || `Vendor #${v.id}`,
                value: String(v.id ?? v.value),
            })),
        [rawVendorOptions]
    );

    // ---- Filter handlers ----

    const handleSearch = (value) => setSearch(value);

    const handleVendorChange = (value) => {
        setVendor(value);
        setCurrentPage(1);
    };
    const handleStatusChange = (value) => {
        setStatus(value);
        setCurrentPage(1);
    };
    const handleReceiptStatusChange = (value) => {
        setReceiptStatus(value);
        setCurrentPage(1);
    };
    const handleBillStatusChange = (value) => {
        setBillStatus(value);
        setCurrentPage(1);
    };
    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        setCurrentPage(1);
    };
    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        setCurrentPage(1);
    };

    // ---- Actions ----

    const handleAddPurchaseOrder = () => {
        dispatch(clearPurchaseOrderError());
        navigate(ADD_ROUTE);
    };

    // DELETE /finance/purchase-order/:id/  (edit navigates inside the actions component)
    const handleDeletePurchaseOrder = useCallback(
        async (row) => {
            const confirmed = window.confirm(
                `Delete purchase order "${row.po_number}"? This cannot be undone.`
            );
            if (!confirmed) return;

            const result = await dispatch(removePurchaseOrder(row.id));
            if (!removePurchaseOrder.fulfilled.match(result)) return; // error shows in banner

            // If that was the last row on this page, step back one page
            if (purchaseOrders.length === 1 && currentPage > 1) {
                setCurrentPage((p) => p - 1); // effect refetches
            } else {
                fetchList();
            }
            fetchDashboard();
        },
        [dispatch, purchaseOrders.length, currentPage, fetchList, fetchDashboard]
    );

    // ---- Derived ----

    const cards = useMemo(
        () => purchaseOrderStats(dashboard, totalItems),
        [dashboard, totalItems]
    );

    const columns = useMemo(
        () => getPurchaseOrderColumns({ onDelete: handleDeletePurchaseOrder }),
        [handleDeletePurchaseOrder]
    );

    return {
        // filters
        search,
        vendor,
        status,
        receiptStatus,
        billStatus,
        startDate,
        endDate,

        // pagination
        currentPage,
        totalPages,
        totalItems,
        setCurrentPage,

        // data
        cards,
        columns,
        paginatedData: purchaseOrders,

        // loading / error
        loading,
        dashboardLoading,
        errorMessage: formatError(error),

        // options
        vendorOptions,
        statusOptions: STATUS_OPTIONS,
        receiptStatusOptions: RECEIPT_STATUS_OPTIONS,
        billStatusOptions: BILL_STATUS_OPTIONS,

        // handlers
        handleSearch,
        handleVendorChange,
        handleStatusChange,
        handleReceiptStatusChange,
        handleBillStatusChange,
        handleStartDateChange,
        handleEndDateChange,
        handleAddPurchaseOrder,
    };
};

export default usePurchaseOrders;