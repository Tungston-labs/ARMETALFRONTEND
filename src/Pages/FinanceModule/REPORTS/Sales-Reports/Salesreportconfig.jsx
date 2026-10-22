import { FiDollarSign, FiShoppingCart, FiFileText } from "react-icons/fi";
import { BsGraphUpArrow } from "react-icons/bs";
import { MdOutlineReceiptLong } from "react-icons/md";

export const formatNumber = (value) =>
    Number(value || 0).toLocaleString("en-US");

export const buildStatsCards = (summary = {}) => [
    {
        title: "Total Sales Revenue",
        count: formatNumber(summary.total_sales_revenue),
        icon: <FiDollarSign />,
        backgroundColor: "#E5F5EC",
        iconColor: "#239653",
    },
    {
        title: "Total Invoices",
        count: formatNumber(summary.total_invoices),
        icon: <FiFileText />,
        backgroundColor: "#E8F0FE",
        iconColor: "#3974D8",
    },
    {
        title: "Products Sold",
        count: formatNumber(summary.products_sold),
        icon: <FiShoppingCart />,
        backgroundColor: "#FFF1DF",
        iconColor: "#F08A18",
    },
    {
        title: "Payments Received",
        count: formatNumber(summary.payments_received),
        icon: <BsGraphUpArrow />,
        backgroundColor: "#F3E8FF",
        iconColor: "#8B5CF6",
    },
    {
        title: "Outstanding Receivables",
        count: formatNumber(summary.outstanding_receivables),
        icon: <MdOutlineReceiptLong />,
        backgroundColor: "#FDE8E8",
        iconColor: "#DC2626",
    },
];

const STATUS_COLORS = {
    paid: { bg: "#E5F5EC", color: "#239653" },
    partial: { bg: "#FFF1DF", color: "#F08A18" },
    unpaid: { bg: "#FDE8E8", color: "#DC2626" },
};

const StatusBadge = ({ value }) => {
    const style = STATUS_COLORS[String(value || "").toLowerCase()] || {
        bg: "#F1F1F1",
        color: "#555",
    };

    return (
        <span
            style={{
                background: style.bg,
                color: style.color,
                padding: "4px 10px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: "nowrap",
            }}
        >
            {value}
        </span>
    );
};

const number = (accessor) => (row) => formatNumber(row[accessor]);

export const salesColumns = [
    { accessor: "invoice_number", header: "Invoice No." },
    { accessor: "date", header: "Date" },
    { accessor: "customer", header: "Customer" },
    { accessor: "amount", header: "Amount", render: number("amount") },
    { accessor: "tax_amount", header: "Tax", render: number("tax_amount") },
    { accessor: "discount", header: "Discount", render: number("discount") },
    { accessor: "net_amount", header: "Net Amount", render: number("net_amount") },
    {
        accessor: "status",
        header: "Status",
        render: (row) => <StatusBadge value={row.status} />,
    },
];

export const statusOptions = ["Unpaid", "Partial", "Paid"];

export const buildCustomerOptions = (customers = []) => [
    ...customers.map((customer) => ({
        label:
            customer.name ||
            customer.customer_name ||
            customer.company_name ||
            customer.display_name ||
            `Customer #${customer.id}`,
        value: customer.id,
    })),
];
