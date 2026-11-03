import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getVendorPurchaseOrders } from "../../../../../Redux/finance/purchases/Vendordetailslice";

/* ---------------- Constants ---------------- */

export const ROWS_PER_PAGE = 10;

export const STATUS_OPTIONS = [
    "Draft",
    "Sent to Vendor",
    "Received",
    "Cancelled",
];

export const STATUS_COLORS = {
    received:           { color: "#018611" },
    sent_to_vendor:     { color: "#F48211" },
    draft:              { color: "#3250B5" },
    cancelled:          { color: "#D32F2F" },
    pending:            { color: "#E65100" },
    approved:           { color: "#00796B" },
    ordered:            { color: "#5E35B1" },
    partially_received: { color: "#558B2F" },
};

/* ---------------- Helpers ---------------- */

export const toStatusKey = (label) => label.toLowerCase().replace(/\s+/g, "_");

// "partially_received" -> "Partially Received"
export const pretty = (v) =>
    v
        ? String(v)
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())
        : "—";

export const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

export const formatError = (error) => {
    if (!error) return "";
    if (typeof error === "string") return error;
    if (error.detail) return error.detail;
    return Object.entries(error)
        .map(([f, m]) => `${f}: ${Array.isArray(m) ? m.join(", ") : m}`)
        .join(" | ");
};

/* ---------------- Hook ---------------- */

const useVendorPurchaseOrders = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const id = params.id ?? params.vendorId;

    const {
        purchaseOrders = [],
        purchaseOrdersSummary = null,
        purchaseOrdersLoading = false,
        purchaseOrdersError: error = null,
    } = useSelector((state) => state.vendorDetail) || {};

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // fetch
    useEffect(() => {
        if (id) dispatch(getVendorPurchaseOrders({ vendorId: id }));
    }, [dispatch, id]);

    // filter (search + status)
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return purchaseOrders.filter((po) => {
            if (status && po.order_status !== toStatusKey(status)) return false;
            if (q && !String(po.po_number || "").toLowerCase().includes(q)) return false;
            return true;
        });
    }, [purchaseOrders, search, status]);

    // pagination
    const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE) || 1;

    const rows = useMemo(() => {
        const start = (currentPage - 1) * ROWS_PER_PAGE;
        return filtered.slice(start, start + ROWS_PER_PAGE);
    }, [filtered, currentPage]);

    // handlers
    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleStatus = (value) => {
        setStatus(value);
        setCurrentPage(1);
    };

    // stats (plain numbers only, no JSX)
    const s = purchaseOrdersSummary || {};
    const stats = {
        totalOrders: s.total_orders ?? 0,
        totalValue: s.total_po_value,
        received: s.completed_orders_count ?? 0,
        awaiting: s.pending_approval_count ?? 0,
        cancelled:
            s.cancelled_orders_count ??
            purchaseOrders.filter((po) => po.order_status === "cancelled").length,
    };

    return {
        id,
        params,
        error,
        loading: purchaseOrdersLoading,
        stats,
        rows,
        totalRecords: filtered.length,
        search,
        status,
        handleSearch,
        handleStatus,
        currentPage,
        totalPages,
        setCurrentPage,
    };
};

export default useVendorPurchaseOrders;