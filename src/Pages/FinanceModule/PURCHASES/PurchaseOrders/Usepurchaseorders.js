import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getVendors } from "../../../../Redux/finance/purchases/vendorsSlice";

import { purchaseOrderData } from "./Purchaseorderdata";
import {
    getPurchaseOrderColumns,
    purchaseOrderStats,
} from "./Purchaseorderstats";

const ROWS_PER_PAGE = 10;
const ADD_ROUTE = "/purchases/purchase-orders/add";

// Filter shows labels; rows store keys like "partially_received"
const STATUS_OPTIONS = [
    "Draft",
    "Pending",
    "Approved",
    "Partially Received",
    "Received",
    "Cancelled",
];
const toStatusKey = (label) => label.toLowerCase().replace(/\s+/g, "_");

const usePurchaseOrders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const vendors = useSelector((state) => state.vendor?.vendors) || [];

    // TODO: replace with redux state (state.purchaseOrder) when the API exists
    const [orders, setOrders] = useState(purchaseOrderData);
    const loading = false;

    // Filters
    const [search, setSearch] = useState("");
    const [vendor, setVendor] = useState("");
    const [status, setStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Vendor filter options come from the vendors already in the app
    useEffect(() => {
        if (!vendors.length) {
            dispatch(getVendors({ page: 1, page_size: 100, ordering: "name" }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    const vendorOptions = useMemo(
        () =>
            vendors.map((v) => ({
                label: v.name || `Vendor #${v.id}`,
                value: String(v.id),
            })),
        [vendors]
    );

    // ---- Filtering (client-side for now; move to API params later) ----

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        const statusKey = status ? toStatusKey(status) : "";

        return orders.filter((o) => {
            if (vendor && String(o.vendor_id) !== String(vendor)) return false;
            if (statusKey && o.order_status !== statusKey) return false;
            if (
                term &&
                !`${o.po_number} ${o.vendor_name}`.toLowerCase().includes(term)
            )
                return false;
            return true;
        });
    }, [orders, search, vendor, status]);

    // ---- Pagination ----

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE) || 1;

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ROWS_PER_PAGE;
        return filtered.slice(start, start + ROWS_PER_PAGE);
    }, [filtered, currentPage]);

    // Keep the page valid if rows shrink (e.g. after a delete)
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [currentPage, totalPages]);

    // ---- Filter handlers ----

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };
    const handleVendorChange = (value) => {
        setVendor(value);
        setCurrentPage(1);
    };
    const handleStatusChange = (value) => {
        setStatus(value);
        setCurrentPage(1);
    };

    // ---- Actions ----

    const handleAddPurchaseOrder = () => navigate(ADD_ROUTE);

    const handleDeletePurchaseOrder = useCallback((row) => {
        const confirmed = window.confirm(
            `Delete purchase order "${row.po_number}"? This cannot be undone.`
        );
        if (!confirmed) return;

        // TODO: dispatch(removePurchaseOrder(row.id)) once the API exists
        setOrders((prev) => prev.filter((o) => o.id !== row.id));
    }, []);

    // ---- Derived ----

    const cards = useMemo(() => purchaseOrderStats(orders), [orders]);

    const columns = useMemo(
        () =>
            getPurchaseOrderColumns({
                onDelete: handleDeletePurchaseOrder,
            }),
        [handleDeletePurchaseOrder]
    );

    return {
        // filters
        search,
        vendor,
        status,

        // pagination
        currentPage,
        totalPages,
        totalItems,
        setCurrentPage,

        // data
        cards,
        columns,
        paginatedData,
        loading,

        // options
        vendorOptions,
        statusOptions: STATUS_OPTIONS,

        // handlers
        handleSearch,
        handleVendorChange,
        handleStatusChange,
        handleAddPurchaseOrder,
    };
};

export default usePurchaseOrders;