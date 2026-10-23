import { formatSAR, normalize } from "./Usevendorreport";

const STATUS_COLORS = {
    paid: { bg: "#E6F8EF", color: "#16A34A" },
    partially_paid: { bg: "#E8F0FF", color: "#3454B9" },
    unpaid: { bg: "#FFF3E0", color: "#FF800B" },
    overdue: { bg: "#FDE8E8", color: "#E63D32" },
};

const vendorColumns = [
    // { accessor: "vendor_code", header: "Vendor Code" },
    { accessor: "vendor_name", header: "Vendor" },
    
    { accessor: "po_count", header: "Purchase Orders" },
    { accessor: "bill_count", header: "Bills" },
    {
        accessor: "purchase_value",
        header: "Purchase Value",
        render: (row) => formatSAR(row.purchase_value),
    },
    {
        accessor: "payments_received",
        header: "Payments Received",
        render: (row) => formatSAR(row.payments_received),
    },
    {
        accessor: "outstanding_value",
        header: "Outstanding Value",
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

export default vendorColumns;