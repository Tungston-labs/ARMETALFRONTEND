import { formatSAR, normalize } from "./Usecustomerreport";

const STATUS_COLORS = {
    paid: { bg: "#E6F8EF", color: "#16A34A" },
    partially_paid: { bg: "#E8F0FF", color: "#3454B9" },
    unpaid: { bg: "#FFF3E0", color: "#FF800B" },
    overdue: { bg: "#FDE8E8", color: "#E63D32" },
};

const customerColumns = [
    { accessor: "customer_name", header: "Customer" },
    { accessor: "invoice", header: "Invoice" },
    { accessor: "invoice_date", header: "Invoice Date" },
    {
        accessor: "revenue",
        header: "Revenue",
        render: (row) => formatSAR(row.revenue),
    },
    {
        accessor: "payment_received",
        header: "Payment Received",
        render: (row) => formatSAR(row.payment_received),
    },
    {
        accessor: "outstanding_value",
        header: "Outstanding",
        render: (row) => formatSAR(row.outstanding_value),
    },
    {
        accessor: "status",
        header: "Status",
        render: (row) => {
            const key = normalize(row.status);
            const style = STATUS_COLORS[key] || {
                bg: "#F3F4F6",
                color: "#374151",
            };

            return (
                <span
                    style={{
                        background: style.bg,
                        color: style.color,
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: "capitalize",
                    }}
                >
                    {String(row.status ?? "").replace(/_/g, " ")}
                </span>
            );
        },
    },
];

export default customerColumns;