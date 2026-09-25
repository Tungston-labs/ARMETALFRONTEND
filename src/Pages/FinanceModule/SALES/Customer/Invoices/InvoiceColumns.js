// invoicesColumns.js
export const invoicesColumns = [
  {
    header: "Invoice No",
    accessor: "invoice_number",
    render: (row) => row.invoice_number || "-",
  },
  {
    header: "Order Ref",
    accessor: "order_ref",
    render: (row) => row.order_ref || "-",
  },
  {
    header: "Invoice Date",
    accessor: "invoice_date",
    render: (row) => row.invoice_date || "-",
  },
  {
    header: "Due Date",
    accessor: "due_date",
    render: (row) => row.due_date || "-",
  },
  {
    header: "Invoice Amount",
    accessor: "invoice_amount",
    render: (row) =>
      Number(row.invoice_amount || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    header: "Paid Amount",
    accessor: "paid_amount",
    render: (row) =>
      Number(row.paid_amount || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    header: "Payment Date",
    accessor: "payment_date",
    render: (row) => row.payment_date || "-",
  },
  {
    header: "Payment Mode",
    accessor: "payment_mode",
    render: (row) => row.payment_mode || "-",
  },
  {
    header: "Status",
    accessor: "status_name",
    render: (row) => row.status_name || row.status || "-",
  },
];