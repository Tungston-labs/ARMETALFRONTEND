// paymentsColumns.js
export const paymentsColumns = [
  {
    header: "Payment No",
    accessor: "payment_receipt_number",
    render: (row) => row.payment_receipt_number || "-",
  },
  {
    header: "Related Invoice",
    accessor: "invoice_number",
    render: (row) => row.invoice_number || "-",
  },
  {
    header: "Date",
    accessor: "payment_date",
    render: (row) => row.payment_date || "-",
  },
  {
    header: "Payment Method",
    accessor: "payment_method_display",
    render: (row) => row.payment_method_display || row.payment_method || "-",
  },
  {
    header: "Amount",
    accessor: "amount",
    render: (row) =>
      Number(row.amount || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    header: "Status",
    accessor: "status_display",
    render: (row) => row.status_display || row.status || "-",
  },
];