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
        header: "Invoice No",
        accessor: "invoice_number",
    },
    {
        header: "SO Ref",
        accessor: "so_ref",
    },
    {
        header: "Customer",
        accessor: "customer",
    },
    {
        header: "Invoice Date",
        accessor: "invoice_date",
    },
    {
        header: "Due Date",
        accessor: "due_date",
    },
    {
        header: "Amount",
        accessor: "amount",
    },
    {
        header: "Paid Balance",
        accessor: "paid_balance",
    },
    {
        header: "Payment Status",
        accessor: "payment_status",
    },
    {
        header: "Action",
        accessor: "actions",
        sortable: false,
       render: (row) => (
  <InvoiceActions
    row={row}
    onDelete={(invoice) => console.log("Delete invoice:", invoice)}
  />
),
    },
];

export const salesInvoiceData = [
    {
        id: 1,
        invoice_number: "INV-001",
        so_ref: "SO-001",
        customer: "ABC Trading",
        invoice_date: "2026-09-02",
        due_date: "2026-09-15",
        amount: "SAR 5,000.00",
        paid_balance: "SAR 5,000.00",
        payment_status: "Paid",
        actions: "actions",
    },
    {
        id: 2,
        invoice_number: "INV-002",
        so_ref: "SO-002",
        customer: "Riyadh Tech",
        invoice_date: "2026-09-05",
        due_date: "2026-09-20",
        amount: "SAR 3,500.00",
        paid_balance: "SAR 1,500.00",
        payment_status: "Partially Paid",
        actions: "actions",
    },
    {
        id: 3,
        invoice_number: "INV-003",
        so_ref: "SO-003",
        customer: "Al Noor Company",
        invoice_date: "2026-09-08",
        due_date: "2026-09-10",
        amount: "SAR 2,800.00",
        paid_balance: "SAR 0.00",
        payment_status: "Overdue",
        actions: "actions",
    },
    {
        id: 4,
        invoice_number: "INV-004",
        so_ref: "SO-004",
        customer: "Saudi Solutions",
        invoice_date: "2026-09-10",
        due_date: "2026-09-25",
        amount: "SAR 7,200.00",
        paid_balance: "SAR 0.00",
        payment_status: "Pending",
        actions: "actions",
    },
    {
        id: 5,
        invoice_number: "INV-005",
        so_ref: "SO-005",
        customer: "Global Industries",
        invoice_date: "2026-09-11",
        due_date: "2026-09-28",
        amount: "SAR 4,750.00",
        paid_balance: "SAR 4,750.00",
        payment_status: "Paid",
        actions: "actions",
    },
];

export const getInvoiceById = (id) =>
    salesInvoiceData.find(
        (row) => String(row.id) === String(id)
    ) || null; 
export const salesInvoiceStats = (stats) => [
    {
        title: "Total Invoices",
        count: stats.totalInvoices,
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
        title: "Paid Invoices",
        count: stats.paidInvoices,
        icon: <FiCheckCircle />,
        backgroundColor: "#E8F8EF",
        iconColor: "#22A06B",
    },
    {
        title: "Pending Invoices",
        count: stats.pendingInvoices,
        icon: <FiClock />,
        backgroundColor: "#FFF4E5",
        iconColor: "#F59E0B",
    },
    {
        title: "Overdue Invoices",
        count: stats.overdueInvoices,
        icon: <FiXCircle />,
        backgroundColor: "#FDECEC",
        iconColor: "#E5484D",
    },
];