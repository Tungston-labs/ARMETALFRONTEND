import React from "react";
import { FiFileText, FiClock, FiCheckCircle, FiPackage, FiDollarSign } from "react-icons/fi";

import ReusableFilter from "../../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../../Components/StatsCards/StatsCards";

import useVendorPurchaseOrders, {
    STATUS_OPTIONS,
    STATUS_COLORS,
    pretty,
    formatAmount,
    formatError,
} from "./UsevendorPurchaseOrders";

/* ---------------- Status badge ---------------- */

const StatusBadge = ({ value }) => {
    const c = STATUS_COLORS[value] || { bg: "#F1F1F1", color: "#555555" };

    return (
        <span
            style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: 999,
                background: c.bg,
                color: c.color,
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: "nowrap",
            }}
        >
            {pretty(value)}
        </span>
    );
};

/* ---------------- Table columns ---------------- */

const purchaseOrderColumns = [
    { header: "PO No", accessor: "po_number" },
    { header: "Order Date", accessor: "po_date" },
    { header: "Delivery Date", accessor: "delivery_date" },
    { header: "Warehouse", accessor: "warehouse" },
    {
        header: "Amount",
        accessor: "total_amount",
        render: (row) => formatAmount(row.total_amount),
    },
    {
        header: "Order Status",
        accessor: "order_status",
        render: (row) => <StatusBadge value={row.order_status} />,
    },
    { header: "Linked Bill", accessor: "linked_bill" },
];

/* ---------------- Page ---------------- */

const VendorPurchaseOrders = () => {
    const {
        id,
        params,
        error,
        loading,
        stats,
        rows,
        totalRecords,
        search,
        status,
        handleSearch,
        handleStatus,
        currentPage,
        totalPages,
        setCurrentPage,
    } = useVendorPurchaseOrders();

    const statsCards = [
        {
            title: "Total Purchase Orders",
            count: stats.totalOrders,
            icon: <FiFileText />,
            backgroundColor: "#EEF2FF",
            iconColor: "#4F46E5",
        },
        {
            title: "Total PO Value",
            count: formatAmount(stats.totalValue),
            icon: <FiDollarSign />,
            backgroundColor: "#FFF7ED",
            iconColor: "#F59E0B",
        },
        {
            title: "Fully Received",
            count: stats.received,
            icon: <FiCheckCircle />,
            backgroundColor: "#EFF6FF",
            iconColor: "#3B82F6",
        },
        {
            title: "Awaiting Delivery",
            count: stats.awaiting,
            icon: <FiClock />,
            backgroundColor: "#fdf9ec",
            iconColor: "#F59E0B",
        },
        {
            title: "Cancelled Orders",
            count: stats.cancelled,
            icon: <FiPackage />,
            backgroundColor: "#fdecec",
            iconColor: "#b91010",
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

            <StatsCards cards={statsCards} loading={loading} />

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
                data={rows}
                loading={loading}
                autoLayout
            />

            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRecords={totalRecords}
                onPageChange={setCurrentPage}
            />
        </>
    );
};

export default VendorPurchaseOrders;