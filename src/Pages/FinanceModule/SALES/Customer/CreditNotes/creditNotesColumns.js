// creditNotesColumns.js
export const creditNotesColumns = [
  {
    header: "Credit Note No",
    accessor: "cn_number",
    render: (row) => row.cn_number || "-",
  },
  {
    header: "Related Invoice",
    accessor: "invoice_ref",
    render: (row) => row.invoice_ref || "-",
  },
  {
    header: "Date",
    accessor: "issue_date",
    render: (row) => row.issue_date || "-",
  },
  {
    header: "Reason",
    accessor: "reason_display",
    render: (row) => row.reason_display || row.reason || "-",
  },
  {
    header: "Credit Amount",
    accessor: "credit_amount",
    render: (row) =>
      Number(row.credit_amount || 0).toLocaleString("en-US", {
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