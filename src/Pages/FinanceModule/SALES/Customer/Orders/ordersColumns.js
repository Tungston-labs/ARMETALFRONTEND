export const ordersColumns = [
  {
    header: "Order No",
    accessor: "so_number",
    render: (row) => row.so_number || "-",
  },
   {
    header: "Quotation Ref",
    accessor: "so_number",
    render: (row) => row.so_number || "-",
  },
  {
    header: "Order Date",
    accessor: "order_date",
    render: (row) => row.order_date || "-",
  },
  {
    header: "Delivery Date",
    accessor: "delivery_date",
    render: (row) => row.delivery_date || "-",
  },
  {
    header: "Order Amount",
    accessor: "order_value",
    render: (row) =>
      Number(row.order_value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    header: "Order Status",
    accessor: "order_status",
    render: (row) => row.order_status || "-",
  },
  {
    header: "Delivery Status",
    accessor: "delivery_status",
    render: (row) => row.delivery_status || "-",
  },
  {
    header: "Invoice Status",
    accessor: "invoice_status",
    render: (row) => row.invoice_status || "-",
  },
];