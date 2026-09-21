import React from "react";
import {
    FiShoppingCart,
    FiDollarSign,
    FiCheckCircle,
    FiClock,
    FiXCircle,
} from "react-icons/fi";

import DeliveryAction from "./Action/DeliveryAction";

export const salesOrderColumns = [
    {
        header: "Order No",
        accessor: "order_number",
    },
    {
        header: "Customer",
        accessor: "customer",
    },
    {
        header: "Order Date",
        accessor: "order_date",
    },
    {
        header: "Delivery Date",
        accessor: "delivery_date",
    },
    {
        header: "Amount",
        accessor: "amount",
    },
    {
        header: "Status",
        accessor: "status",
    },
    {
        header: "Action",
        accessor: "actions",
        sortable: false,
        render: (row) => (
            <DeliveryAction
                row={row}
                onDelete={(order) => console.log("Delete order:", order)}
            />
        ),
    },
];

export const salesOrderData = [
    {
        id: 1,
        order_number: "SO-001",
        customer: "ABC Trading",
        order_date: "2026-09-02",
        delivery_date: "2026-09-15",
        amount: "SAR 5,000.00",
        status: "Completed",
        actions: "actions",
    },
    {
        id: 2,
        order_number: "SO-002",
        customer: "Riyadh Tech",
        order_date: "2026-09-05",
        delivery_date: "2026-09-20",
        amount: "SAR 3,500.00",
        status: "Pending",
        actions: "actions",
    },
    {
        id: 3,
        order_number: "SO-003",
        customer: "Al Noor Company",
        order_date: "2026-09-08",
        delivery_date: "2026-09-10",
        amount: "SAR 2,800.00",
        status: "Cancelled",
        actions: "actions",
    },
    {
        id: 4,
        order_number: "SO-004",
        customer: "Saudi Solutions",
        order_date: "2026-09-10",
        delivery_date: "2026-09-25",
        amount: "SAR 7,200.00",
        status: "Pending",
        actions: "actions",
    },
    {
        id: 5,
        order_number: "SO-005",
        customer: "Global Industries",
        order_date: "2026-09-11",
        delivery_date: "2026-09-28",
        amount: "SAR 4,750.00",
        status: "Completed",
        actions: "actions",
    },
];

export const getOrderById = (id) =>
    salesOrderData.find(
        (row) => String(row.id) === String(id)
    ) || null;

export const salesOrderStats = (stats) => [
    {
        title: "Total Orders",
        count: stats.totalOrders,
        icon: <FiShoppingCart />,
        backgroundColor: "#E8F1FF",
        iconColor: "#3478F6",
    },
    {
        title: "Total Amount",
        count: stats.totalAmount,
        icon: <FiDollarSign />,
        backgroundColor: "#FFF4E5",
        iconColor: "#F59E0B",
    },
    {
        title: "Completed Orders",
        count: stats.completedOrders,
        icon: <FiCheckCircle />,
        backgroundColor: "#E8F8EF",
        iconColor: "#22A06B",
    },
    {
        title: "Pending Orders",
        count: stats.pendingOrders,
        icon: <FiClock />,
        backgroundColor: "#FFF4E5",
        iconColor: "#F59E0B",
    },
    {
        title: "Cancelled Orders",
        count: stats.cancelledOrders,
        icon: <FiXCircle />,
        backgroundColor: "#FDECEC",
        iconColor: "#E5484D",
    },
];