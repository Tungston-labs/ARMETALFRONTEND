
export const billingColumns = [
  {
    header: "Contract No",
    accessor: "contract_number",
    render: (row) => row.contract_number || "-",
  },
  {
    header: "Customer",
    accessor: "customer_name",
    render: (row) => row.customer_name || "-",
  },
  {
    header: "Service",
    accessor: "service_name",
    render: (row) => row.service_name || "-",
  },
  {
    header: "Billing Cycle",
    accessor: "billing_cycle",
    render: (row) => row.billing_cycle || "-",
  },
   {
    header: "Invoice Date",
    accessor: "invoice_date",
    render: (row) => row.invoice_date || "-",
  },
  {
    header: "Next Invoice Date",
    accessor: "next_invoice_date",
    render: (row) => row.next_invoice_date || "-",
  },
  {
    header: "Amount",
    accessor: "monthly_amount",
    render: (row) =>
      Number(row.monthly_amount || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    header: "Auto Renew",
    accessor: "auto_renew_display",
    render: (row) => row.auto_renew_display || "-",
  },
  {
    header: "Status",
    accessor: "recurrence_status",
    render: (row) => row.recurrence_status || "-",
  },
];