
import React from "react";
import {
    FiShoppingCart,
    FiDollarSign,
    FiCheckCircle,
    FiClock,
    FiXCircle,
} from "react-icons/fi";
import InvoiceActions from "./action/InvoiceActions";
  export const salesInvoiceColumns = [
    {
        header: "Invoice Number",
        accessor: "invoice_number",
    },
    {
        header: "Invoice Date",
        accessor: "invoice_date",
    },
    {
        header: "Customer",
        accessor: "customer",
    },
    {
        header: "Due Date",
        accessor: "due_date",
    },
    {
        header: "Total Amount",
        accessor: "total_amount",
    },
    {
        header: "Status",
        accessor: "status",
    },
      {
        header: "Actions",
        accessor: "actions",
        sortable: false,

        render: (row) => (
            <InvoiceActions
                row={row}
                onView={(invoice) =>
                    console.log(
                        "View invoice:",
                        invoice
                    )
                }
                onEdit={(invoice) =>
                    console.log(
                        "Edit invoice:",
                        invoice
                    )
                }
                onDelete={(invoice) =>
                    console.log(
                        "Delete invoice:",
                        invoice
                    )
                }
            />
        ),
    },
  ];
  export const salesInvoiceData = [
    {
        id: 1,
        invoice_number: "INV-001",
        invoice_date: "2026-09-02",
        customer: "ABC Trading",
        due_date: "2026-09-15",
        total_amount: "SAR 5,000.00",
        status: "Completed",
        actions: "actions",
    },
    {
        id: 2,
        invoice_number: "INV-002",
        invoice_date: "2026-09-05",
        customer: "Riyadh Tech",
        due_date: "2026-09-20",
        total_amount: "SAR 3,500.00",
        status: "Pending",
        actions: "actions",
    },
    {
        id: 3,
        invoice_number: "INV-003",
        invoice_date: "2026-09-08",
        customer: "Al Noor Company",
        due_date: "2026-09-10",
        total_amount: "SAR 2,800.00",
        status: "Cancelled",
        actions: "actions",
    },
    {
        id: 4,
        invoice_number: "INV-004",
        invoice_date: "2026-09-10",
        customer: "Saudi Solutions",
        due_date: "2026-09-25",
        total_amount: "SAR 7,200.00",
        status: "Completed",
        actions: "actions",
    },
];
export const salesInvoiceStats = (stats) => [
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