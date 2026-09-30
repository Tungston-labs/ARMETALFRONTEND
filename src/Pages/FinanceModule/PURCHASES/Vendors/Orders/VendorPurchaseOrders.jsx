import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FiFileText, FiClock, FiCheckCircle, FiPackage } from "react-icons/fi";

import ReusableFilter from "../../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../../Components/StatsCards/StatsCards";

import { getVendorPurchaseOrders } from "../../../../../Redux/finance/purchases/Vendordetailslice";

const ROWS_PER_PAGE = 10;

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

// "partially_received" -> "Partially Received"
const pretty = (v) =>
    v
        ? String(v)
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())
        : "—";

const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const formatError = (error) => {
    if (!error) return "";
    if (typeof error === "string") return error;
    if (error.detail) return error.detail;
    return Object.entries(error)
        .map(([f, m]) => `${f}: ${Array.isArray(m) ? m.join(", ") : m}`)
        .join(" | ");
};

// IMPORTANT: I haven't seen employeeColumns. Match these keys
// (header / accessor / render) to the format ReusableTable expects.
const purchaseOrderColumns = [
    { header: "PO Number", accessor: "po_number" },
    { header: "PO Date", accessor: "po_date" },
    { header: "Delivery Date", accessor: "delivery_date" },
    {
        header: "Amount",
        accessor: "total_amount",
        render: (row) => formatAmount(row.total_amount),
    },
    {
        header: "Order Status",
        accessor: "order_status",
        render: (row) => pretty(row.order_status),
    },
    {
        header: "Delivery Status",
        accessor: "delivery_status",
        render: (row) => pretty(row.delivery_status),
    },
    {
        header: "Bill Status",
        accessor: "bill_status",
        render: (row) => pretty(row.bill_status),
    },
    {
        header: "Payment Status",
        accessor: "payment_status",
        render: (row) => pretty(row.payment_status),
    },
];

const VendorPurchaseOrders = () => {
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

    useEffect(() => {
        if (id) dispatch(getVendorPurchaseOrders({ vendorId: id }));
    }, [dispatch, id]);

    // The API returns every order, so search and status filter run here
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return purchaseOrders.filter((po) => {
            if (status && po.order_status !== toStatusKey(status)) return false;
            if (q && !String(po.po_number || "").toLowerCase().includes(q)) return false;
            return true;
        });
    }, [purchaseOrders, search, status]);

    const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE) || 1;

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ROWS_PER_PAGE;
        return filtered.slice(start, start + ROWS_PER_PAGE);
    }, [filtered, currentPage]);

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };
    const handleStatus = (value) => {
        setStatus(value);
        setCurrentPage(1);
    };

    const s = purchaseOrdersSummary || {};
    const statsCards = [
        {
            title: "Total Purchase Orders",
            count: s.total_orders ?? 0,
            icon: <FiFileText />,
            backgroundColor: "#EEF2FF",
            iconColor: "#4F46E5",
        },
        {
            title: "Pending Approval",
            count: s.pending_approval_count ?? 0,
            icon: <FiClock />,
            backgroundColor: "#FFF7ED",
            iconColor: "#F59E0B",
        },
        {
            title: "Open Orders",
            count: s.open_orders_count ?? 0,
            icon: <FiPackage />,
            backgroundColor: "#EFF6FF",
            iconColor: "#3B82F6",
        },
        {
            title: "Completed Orders",
            count: s.completed_orders_count ?? 0,
            icon: <FiCheckCircle />,
            backgroundColor: "#ECFDF5",
            iconColor: "#10B981",
        },
    ];

    if (!id) {
        return (
            <p style={{ padding: 24, color: "#B00020" }}>
                No vendor id in the URL ({Object.keys(params).join(", ") || "no params"}).
            </p>
        );
    }

    return (
        <>
            {error && (
                <div
                    style={{
                        margin: "12px 0",
                        padding: "10px 14px",
                        borderRadius: 6,
                        background: "#FDEEEE",
                        color: "#B00020",
                        fontSize: 14,
                    }}
                >
                    {formatError(error)}
                </div>
            )}

            <StatsCards cards={statsCards} loading={purchaseOrdersLoading} />

            <ReusableFilter
                search={search}
                onSearch={handleSearch}
                searchPlaceholder="Search PO number"
                status={status}
                statuses={STATUS_OPTIONS}
                onStatus={handleStatus}
                showSearch
                showStatus
            />

            <ReusableTable
                columns={purchaseOrderColumns}
                data={paginatedData}
                loading={purchaseOrdersLoading}
            />

            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRecords={filtered.length}
                onPageChange={setCurrentPage}
            />
        </>
    );
};

export default VendorPurchaseOrders;